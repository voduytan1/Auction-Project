package com.example.backend.service;

import com.example.backend.dto.bid.AutoBidResponse;
import com.example.backend.dto.bid.BidHistoryResponse;
import com.example.backend.dto.bid.PlaceAutoBidRequest;
import com.example.backend.dto.bid.PlaceAutoBidResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.AutoBidMapper;
import com.example.backend.mapper.BidHistoryMapper;
import com.example.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AutoBidService {
   private final AutoBidRepository autoBidRepository;
    private final BidHistoryRepository bidHistoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BlockedBidderRepository blockedBidderRepository;
    private final RatingRepository ratingRepository;
    private final AutoBidMapper autoBidMapper;
    private final BidHistoryMapper bidHistoryMapper;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final TransactionService transactionService;
    private final EmailService emailService;

    @Transactional
    public PlaceAutoBidResponse placeAutoBid(UUID bidderid, PlaceAutoBidRequest request) {
        log.info("Bidder {} đang đặt autobid cho product {}", bidderid, request.getProductid());

        // 1. VALIDATE BIDDER
        User bidder = userRepository.findById(bidderid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Bidder với id " + bidderid));

        // 2. VALIDATE PRODUCT
        Product product = productRepository.findByIdForUpdate(request.getProductid())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id " + request.getProductid()));

        // 3. CHECK ĐIỀU KIỆN ĐẤU GIÁ
        validateBidConditions(bidder, product);

        // 4. CHECK GIÁ MUA NGAY - Nếu giá tối đa >= giá mua ngay → Mua ngay luôn
        if (product.getGiaMuaNgay() != null && 
            request.getGiaToiDa().compareTo(product.getGiaMuaNgay()) >= 0) {
            return handleBuyNowFromAutoBid(bidder, product);
        }

        // 5. CHECK GIÁ TỐI ĐA HỢP LỆ
        validateMaxPrice(product, request.getGiaToiDa());

        // get email người giữ giá cũ
        String oldBidderEmail;
        if(product.getCurrentBidder() == null){
            oldBidderEmail=null;
        }else{
            oldBidderEmail = product.getCurrentBidder().getEmail();
        }

        // 6. XỬ LÝ AUTOBID
        AutoBid autoBid = processAutoBid(bidder, product, request.getGiaToiDa());

        // 7. CHẠY LOGIC COMPETE GIỮA CÁC AUTOBID
        Product productResult = runAutoBidCompetition(product);

        // Gửi email cho người giữ giá hiện tại, người giữ giá cũ, người bán
        List<String> emailList = new ArrayList<>();

        emailList.add(bidder.getEmail());
        emailList.add(product.getSeller().getEmail());

        if (oldBidderEmail != null) {
            emailList.add(oldBidderEmail);
        }

        // Chuyển List thành Array
        String[] emails = emailList.toArray(new String[0]);

        Product productFinal = productResult != null ? productResult : product;

        emailService.sendPlaceBidMail(emails,productFinal.getTenSanPham(),productFinal.getProductid(), productFinal.getGiaHienTai(), productFinal.getCurrentBidder().getHoVaTen());
        // 9. TẠO RESPONSE
        return createResponse(autoBid, product);
    }

    @Transactional
    public void processBlockedBidder(Product product, BlockedBidder blockedBidder) {
        UUID blockedBidderId = blockedBidder.getBidder().getUserid();
        String blockedEmail = blockedBidder.getBidder().getEmail();
        String reason = blockedBidder.getLyDo();

        // 1. Gửi mail thông báo
        emailService.sendBlockedNotification(blockedEmail, product.getTenSanPham(), reason);

        // 2. Vô hiệu hóa AutoBid (nếu có)
        Optional<AutoBid> autoBidOpt = autoBidRepository
                .findByProductProductidAndBidderUseridAndIsActiveTrue(product.getProductid(), blockedBidderId);
        if (autoBidOpt.isPresent()) {
            AutoBid autoBid = autoBidOpt.get();
            autoBid.setIsActive(false);
            autoBidRepository.save(autoBid);
        }

        // --- BƯỚC MỚI: ĐẾM SỐ LƯỢT ĐẤU GIÁ VÀ TRỪ ĐI ---
        Long blockedBidCount = bidHistoryRepository.countByProductProductidAndBidderUserid(
                product.getProductid(), blockedBidderId);
        
        if (blockedBidCount > 0) {
            int currentBidCount = product.getSoLuotRaGia();
            int newBidCount = Math.max(0, currentBidCount - blockedBidCount.intValue());
            product.setSoLuotRaGia(newBidCount);
            log.info("Trừ {} lượt đấu giá của user bị chặn. Số lượt cũ: {}, mới: {}", 
                    blockedBidCount, currentBidCount, newBidCount);
        }

        // --- XÓA LỊCH SỬ ĐẤU GIÁ (BID HISTORY) ---
        bidHistoryRepository.deleteAllByProductAndBidder(product.getProductid(), blockedBidderId);
        log.info("Đã xóa lịch sử đấu giá của user {} cho sản phẩm {}", blockedBidderId, product.getProductid());

        // 3. Kiểm tra xem người bị chặn có đang là Winner không?
        User currentWinner = product.getCurrentBidder();

        // Nếu người bị chặn đang giữ giá cao nhất -> Tìm giá thứ 2
        if (currentWinner != null && currentWinner.getUserid().equals(blockedBidderId)) {
            log.info("Người bị chặn đang là Winner -> Tìm giá cao nhất tiếp theo");

            // Tìm bid history cao nhất còn lại (không phải của người bị chặn)
            List<BidHistory> remainingBids = bidHistoryRepository
                    .findByProductProductidOrderByGiaDatDescCreatedAtDesc(product.getProductid());

            if (!remainingBids.isEmpty()) {
                // Lấy bid cao nhất còn lại làm winner mới
                BidHistory highestRemainingBid = remainingBids.get(0);
                
                product.setCurrentBidder(highestRemainingBid.getBidder());
                product.setGiaHienTai(highestRemainingBid.getGiaDat());
                productRepository.save(product);

                // Gửi mail chúc mừng Winner mới
                emailService.sendNewWinnerNotification(
                        highestRemainingBid.getBidder().getEmail(),
                        product.getTenSanPham(),
                        product.getProductid(),
                        highestRemainingBid.getGiaDat()
                );

                // Báo socket UI cập nhật lại tên người thắng và giá mới
                webSocketEventPublisher.publishBidUpdate(product, "NEW_WINNER_FOUND");
                
                log.info("Winner mới: {} với giá {}", 
                        highestRemainingBid.getBidder().getUsername(), 
                        highestRemainingBid.getGiaDat());
            } else {
                // Không còn ai đấu giá -> Reset về giá khởi điểm
                product.setCurrentBidder(null);
                product.setGiaHienTai(product.getGiaKhoiDiem());
                productRepository.save(product);

                webSocketEventPublisher.publishBidUpdate(product, "NO_BIDDER_LEFT");
                log.info("Không còn bidder nào, reset về giá khởi điểm");
            }
        } else {
            // Trường hợp người bị chặn KHÔNG phải là Winner
            productRepository.save(product);
            webSocketEventPublisher.publishBidUpdate(product, "HISTORY_REMOVED");
        }
    }

    /**
     * VALIDATE ĐIỀU KIỆN ĐẤU GIÁ
     */
    private void validateBidConditions(User bidder, Product product) {
        // Check sản phẩm đang active
        if (product.getTrangThai() != ProductStatus.ACTIVE) {
            throw new IllegalArgumentException("Sản phẩm không trong trạng thái đấu giá");
        }

        // Check đã hết hạn chưa
        if (product.getThoiGianKetThuc().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Sản phẩm đã kết thúc đấu giá");
        }

        // Check bidder không phải là seller
        if (product.getSeller().getUserid().equals(bidder.getUserid())) {
            throw new ForbiddenException("Bạn không thể đấu giá sản phẩm của chính mình");
        }

        // Check bidder có bị block không
        if (blockedBidderRepository.existsByProductProductidAndBidderUserid(
                product.getProductid(), bidder.getUserid())) {
            throw new ForbiddenException("Bạn đã bị từ chối đấu giá sản phẩm này");
        }

        // Check rating của bidder
        validateBidderRating(bidder, product);
    }

    /**
     * VALIDATE RATING CỦA BIDDER
     */
    private void validateBidderRating(User bidder, Product product) {
        Long totalRatings = ratingRepository.countByRateeUserid(bidder.getUserid());

        // Nếu chưa có đánh giá
        if (totalRatings == 0) {
            // Check seller có cho phép bidder chưa có đánh giá không
            if (!product.getChoPhepBidderChuaDanhGia()) {
                throw new ForbiddenException("Sản phẩm này không cho phép người chưa có đánh giá tham gia");
            }
            return;
        }

        // Nếu đã có đánh giá, check tỷ lệ >= 80%
        Double ratingPercentage = ratingRepository.calculateRatingPercentage(bidder.getUserid());
        if (ratingPercentage < 80.0) {
            if (!product.getChoPhepBidderChuaDanhGia()) {
                throw new ForbiddenException(
                        String.format("Điểm đánh giá của bạn là %.1f%%, cần tối thiểu 80%% để tham gia đấu giá",
                                ratingPercentage)
                );
            }
        }
    }

    /**
     * VALIDATE GIÁ TỐI ĐA
     */
    private void validateMaxPrice(Product product, BigDecimal giaToiDa) {
        // Giá tối đa phải >= giá hiện tại + bước giá
        BigDecimal minRequired = product.getGiaHienTai().add(product.getBuocGia());
        if (giaToiDa.compareTo(minRequired) < 0) {
            throw new IllegalArgumentException(
                    String.format("Giá tối đa phải >= %s (giá hiện tại + bước giá)",
                            minRequired)
            );
        }

        BigDecimal difference = giaToiDa.subtract(product.getGiaHienTai());
        BigDecimal step = product.getBuocGia();
        if (difference.remainder(step).compareTo(BigDecimal.ZERO) != 0) {
            BigDecimal examplePrice = giaToiDa.subtract(difference.add(product.getBuocGia()).remainder(step));
            throw new IllegalArgumentException("Giá tối đa phải có dạng <giá hiện tại + n x bước giá> (ví dụ: " + examplePrice + ")");
        }
    }

    /**
     * XỬ LÝ AUTOBID (TẠO MỚI HOẶC CẬP NHẬT)
     */
    private AutoBid processAutoBid(User bidder, Product product, BigDecimal giaToiDa) {
        Optional<AutoBid> existingAutoBid = autoBidRepository
                .findByProductProductidAndBidderUseridAndIsActiveTrue(
                        product.getProductid(), bidder.getUserid()
                );

        if (existingAutoBid.isPresent()) {
            // Cập nhật giá tối đa
            AutoBid autoBid = existingAutoBid.get();
            autoBid.setGiaToiDa(giaToiDa);
            return autoBidRepository.save(autoBid);
        } else {
            // Tạo autobid mới
            AutoBid newAutoBid = AutoBid.builder()
                    .product(product)
                    .bidder(bidder)
                    .giaToiDa(giaToiDa)
                    .isActive(true)
                    .build();
            return autoBidRepository.save(newAutoBid);
        }
    }

    /**
     * CHẠY LOGIC COMPETE - PHẦN QUAN TRỌNG NHẤT!
     * TÍCH HỢP WEBSOCKET ĐỂ BROADCAST REAL-TIME
     */
    @Transactional
    public Product runAutoBidCompetition(Product product) {
        log.info("Chạy AutoBid competition cho product {}", product.getProductid());

        // Lấy tất cả autobid active, sắp xếp theo giá tối đa giảm dần
        List<AutoBid> autoBids = autoBidRepository
                .findActiveAutoBidsByProductOrderByGiaToiDaDesc(product.getProductid());

        if (autoBids.isEmpty()) {
            return null;
        }

        // Lấy autobid cao nhất (winner)
        AutoBid highestBid = autoBids.get(0);
        User currentWinner = product.getCurrentBidder();

        BigDecimal currentPrice = product.getGiaHienTai();
        BigDecimal startPrice = product.getGiaKhoiDiem();
        BigDecimal stepPrice = product.getBuocGia();

        BigDecimal newPrice;

        if (autoBids.size() == 1) {
            // Nếu người này ĐÃ LÀ Winner rồi -> DO NOTHING (Chặn lỗi tự nâng giá)
            if (currentWinner != null && currentWinner.getUserid().equals(highestBid.getBidder().getUserid())) {
                log.info("User {} tự update giá max nhưng đang là winner -> Giữ nguyên giá hiện tại", currentWinner.getUsername());
                return null;
            }

            // Nếu là người đầu tiên đặt giá cho sản phẩm
            // Giá = Giá khởi điểm
            newPrice = startPrice;

            // Đảm bảo không thấp hơn giá hiện tại (nếu có logic nào đó set giá trước đó)
            newPrice = newPrice.max(currentPrice);
        } else {
            // Người về nhì (Người đẩy giá)
            AutoBid secondHighestBid = autoBids.get(1);

            // [QUAN TRỌNG] Logic chuẩn Proxy Bidding:
            // Giá sàn để thắng = Giá Max của người về Nhì + 1 Bước giá
            // (Đây là lý do tại sao dòng #3 và #5 trong ví dụ của bạn lại cộng thêm bước giá)
            BigDecimal priceToBeat = secondHighestBid.getGiaToiDa().add(stepPrice);

            // Giá mới không được vượt quá "Khả năng chi trả tối đa" của người thắng (Highest Bidder)
            newPrice = priceToBeat.min(highestBid.getGiaToiDa());

            // Safety check: Giá mới không được thấp hơn giá hiện tại
            newPrice = newPrice.max(currentPrice);

            // [CHECK LỖI SPAM]
            // Nếu người Nhất đang giữ giá, và Giá tính toán (newPrice) bằng y hệt Giá hiện tại
            // Thì không cần update lại DB làm gì.
            if (currentWinner != null
                    && currentWinner.getUserid().equals(highestBid.getBidder().getUserid())
                    && newPrice.compareTo(currentPrice) == 0) {
                return null;
            }
        }

        // --- CẬP NHẬT DB VÀ GỬI SOCKET ---
        // Update khi có sự thay đổi về Giá hoặc Người thắng
        boolean priceChanged = newPrice.compareTo(currentPrice) != 0;
        boolean winnerChanged = currentWinner == null || !currentWinner.getUserid().equals(highestBid.getBidder().getUserid());

        if (priceChanged || winnerChanged) {
            product.setGiaHienTai(newPrice);
            product.setCurrentBidder(highestBid.getBidder());
            product.setSoLuotRaGia(product.getSoLuotRaGia() + 1);
            Product productResult = productRepository.save(product);

            // Ghi lịch sử đấu giá
            BidHistory bidHistory = BidHistory.builder()
                    .product(product)
                    .bidder(highestBid.getBidder())
                    .giaDat(newPrice)
                    .build();
            bidHistory = bidHistoryRepository.save(bidHistory);

            log.info("Product {} - Update: Giá {} - Winner {}",
                    product.getProductid(), newPrice, highestBid.getBidder().getUsername());

            // Broadcast Socket
            webSocketEventPublisher.publishBidUpdate(product, "AUTO_BID");
            webSocketEventPublisher.publishNewBidHistory(bidHistory);

            return productResult;
        }

        return null;
    }


    /**
     * XỬ LÝ MUA NGAY TỪ AUTO-BID
     * Khi giá tối đa >= giá mua ngay, tự động mua ngay sản phẩm
     */
    @Transactional
    public PlaceAutoBidResponse handleBuyNowFromAutoBid(User bidder, Product product) {
        log.info("Auto-bid {} triggered BUY NOW for product {} - Buy now: {}",
                bidder.getUserid(), product.getProductid(), product.getGiaMuaNgay());

        if (blockedBidderRepository.existsByProductProductidAndBidderUserid(
                product.getProductid(), bidder.getUserid())) {
            throw new ForbiddenException("Bạn đã bị từ chối đấu giá sản phẩm này");
        }

        if(product.getGiaMuaNgay()==null){
            throw new ForbiddenException("Sản phẩm này không cho phép mua ngay");
        }

        // Cập nhật product về trạng thái COMPLETED
        product.setGiaHienTai(product.getGiaMuaNgay());
        product.setCurrentBidder(bidder);
        product.setTrangThai(ProductStatus.COMPLETED);
        product.setThoiGianKetThuc(LocalDateTime.now());
        product.setSoLuotRaGia(product.getSoLuotRaGia() + 1);
        product = productRepository.save(product);

        // Tạo bid history cho mua ngay
        BidHistory bidHistory = BidHistory.builder()
                .product(product)
                .bidder(bidder)
                .giaDat(product.getGiaMuaNgay())
                .build();
        bidHistoryRepository.save(bidHistory);

        // Hủy tất cả auto-bid còn active cho product này
        List<AutoBid> activeAutoBids = autoBidRepository
                .findActiveAutoBidsByProductOrderByGiaToiDaDesc(product.getProductid());
        activeAutoBids.forEach(ab -> ab.setIsActive(false));
        autoBidRepository.saveAll(activeAutoBids);

        Transaction transaction = Transaction.builder()
                .product(product)
                .buyer(bidder)
                .seller(product.getSeller())
                .giaCuoiCung(product.getGiaMuaNgay())
                .trangThai(TransactionStatus.PENDING_PAYMENT)
                .paymentMethod("Stripe")
                .build();

        Transaction transactionResult = transactionService.createTransaction(transaction);

        // ⚡ BROADCAST REAL-TIME
        webSocketEventPublisher.publishBidUpdate(product, "BUY_NOW");
        webSocketEventPublisher.publishNewBidHistory(bidHistory);
        webSocketEventPublisher.publishProductStatusChange(
                product, "COMPLETED", "Sản phẩm đã được mua ngay qua Auto-Bid");

        // Tạo response đặc biệt cho trường hợp mua ngay
        return PlaceAutoBidResponse.builder()
                .success(true)
                .message("Giá tối đa của bạn đã đạt giá mua ngay! Sản phẩm đã được mua thành công.")
                .autoBid(null) // Không có auto-bid vì đã mua ngay
                .giaHienTaiSanPham(product.getGiaMuaNgay())
                .currentWinner(maskBidderName(bidder.getHoVaTen()))
                .transactionId(transactionResult.getTransactionid())
                .build();
    }

    /**
     * TẠO RESPONSE
     */
    private PlaceAutoBidResponse createResponse(AutoBid autoBid, Product product) {
        return PlaceAutoBidResponse.builder()
                .success(true)
                .message("Đặt giá tự động thành công")
                .autoBid(autoBidMapper.toResponse(autoBid))
                .giaHienTaiSanPham(product.getGiaHienTai())
                .currentWinner(product.getCurrentBidder() != null ?
                        maskBidderName(product.getCurrentBidder().getHoVaTen()) : null)
                .build();
    }

    /**
     * MASK TÊN BIDDER: "Nguyễn Văn Khoa" -> "****Khoa"
     */
    private String maskBidderName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "****";
        }
        String[] parts = fullName.trim().split("\\s+");
        String lastName = parts[parts.length - 1];
        return "****" + lastName;
    }

    /**
     * LẤY LỊCH SỬ ĐẤU GIÁ (MASKED)
     */
    public Page<@NotNull BidHistoryResponse> getBidHistory(Long productid, Pageable pageable) {
        return bidHistoryRepository.findByProductProductidOrderByCreatedAtDesc(productid, pageable)
                .map(bidHistoryMapper::toResponse);
    }

    /**
     * LẤY DANH SÁCH AUTOBID CỦA BIDDER
     */
    public List<AutoBidResponse> getMyAutoBids(UUID bidderid) {
        return autoBidRepository.findActiveAutoBidsByBidderOnActiveProducts(bidderid)
                .stream()
                .map(autoBidMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * HỦY AUTOBID
     */
    @Transactional
    public void cancelAutoBid(UUID bidderid, Long autobidid) {
        AutoBid autoBid = autoBidRepository.findById(autobidid)
                .orElseThrow(() -> new EntityNotFoundException("AutoBid không tồn tại"));

        // Check quyền sở hữu
        if (!autoBid.getBidder().getUserid().equals(bidderid)) {
            throw new ForbiddenException("Bạn không có quyền hủy autobid này");
        }

        // Đánh dấu inactive
        autoBid.setIsActive(false);
        autoBidRepository.save(autoBid);

        // Chạy lại competition để cập nhật giá
        runAutoBidCompetition(autoBid.getProduct());
    }
}

