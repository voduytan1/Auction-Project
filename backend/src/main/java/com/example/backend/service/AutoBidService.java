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

    @Transactional
    public PlaceAutoBidResponse placeAutoBid(UUID bidderid, PlaceAutoBidRequest request) {
        log.info("Bidder {} đang đặt autobid cho product {}", bidderid, request.getProductid());

        // 1. VALIDATE BIDDER
        User bidder = userRepository.findById(bidderid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Bidder với id " + bidderid));

        // 2. VALIDATE PRODUCT
        Product product = productRepository.findById(request.getProductid())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id " + request.getProductid()));

        // 3. CHECK ĐIỀU KIỆN ĐẤU GIÁ
        validateBidConditions(bidder, product);

        // 4. CHECK GIÁ TỐI ĐA HỢP LỆ
        validateMaxPrice(product, request.getGiaToiDa());

        // 5. XỬ LÝ AUTOBID
        AutoBid autoBid = processAutoBid(bidder, product, request.getGiaToiDa());

        // 6. CHẠY LOGIC COMPETE GIỮA CÁC AUTOBID
        runAutoBidCompetition(product);

        // 7. TẢI LẠI PRODUCT ĐỂ LẤY DỮ LIỆU MỚI NHẤT
        product = productRepository.findById(product.getProductid()).get();

        // 8. TẠO RESPONSE
        return createResponse(autoBid, product);
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
            throw new ForbiddenException(
                    String.format("Điểm đánh giá của bạn là %.1f%%, cần tối thiểu 80%% để tham gia đấu giá",
                            ratingPercentage)
            );
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
    public void runAutoBidCompetition(Product product) {
        log.info("Chạy AutoBid competition cho product {}", product.getProductid());

        // Lấy tất cả autobid active, sắp xếp theo giá tối đa giảm dần
        List<AutoBid> autoBids = autoBidRepository
                .findActiveAutoBidsByProductOrderByGiaToiDaDesc(product.getProductid());

        if (autoBids.isEmpty()) {
            return;
        }

        // Lấy autobid cao nhất (winner)
        AutoBid highestAutoBid = autoBids.get(0);
        BigDecimal newPrice;

        if (autoBids.size() == 1) {
            // Chỉ có 1 người đấu giá
            // Giá = max(giá khởi điểm, giá hiện tại) + bước giá
            newPrice = product.getGiaHienTai().max(product.getGiaKhoiDiem()).add(product.getBuocGia());
            
            // Đảm bảo không vượt quá giá tối đa
            if (newPrice.compareTo(highestAutoBid.getGiaToiDa()) > 0) {
                newPrice = highestAutoBid.getGiaToiDa();
            }
        } else {
            // Có >= 2 người đấu giá
            AutoBid secondHighestAutoBid = autoBids.get(1);

            // Giá mới = min(giá tối đa của winner, giá tối đa của người thứ 2 + bước giá)
            BigDecimal priceBasedOnSecond = secondHighestAutoBid.getGiaToiDa()
                    .add(product.getBuocGia());
            newPrice = highestAutoBid.getGiaToiDa().min(priceBasedOnSecond);
        }

        // Chỉ cập nhật nếu giá mới > giá hiện tại
        if (newPrice.compareTo(product.getGiaHienTai()) > 0) {
            // Cập nhật giá sản phẩm
            product.setGiaHienTai(newPrice);
            product.setCurrentBidder(highestAutoBid.getBidder());
            product.setSoLuotRaGia(product.getSoLuotRaGia() + 1);
            productRepository.save(product);

            // Ghi lịch sử
            BidHistory bidHistory = BidHistory.builder()
                    .product(product)
                    .bidder(highestAutoBid.getBidder())
                    .giaDat(newPrice)
                    .build();
            bidHistory = bidHistoryRepository.save(bidHistory);

            log.info("Product {} - Giá mới: {} - Winner: {}",
                    product.getProductid(), newPrice, highestAutoBid.getBidder().getUsername());

            // ⚡ BROADCAST REAL-TIME UPDATE QUA WEBSOCKET
            webSocketEventPublisher.publishBidUpdate(product, "AUTO_BID");
            webSocketEventPublisher.publishNewBidHistory(bidHistory);
        }
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

