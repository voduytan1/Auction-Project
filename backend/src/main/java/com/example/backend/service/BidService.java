package com.example.backend.service;

import com.example.backend.dto.bid.BidHistoryResponse;
import com.example.backend.dto.bid.PlaceBidRequest;
import com.example.backend.dto.bid.PlaceBidResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.ForbiddenException;
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
import java.util.UUID;

/**
 * Service xử lý đấu giá thông thường (không phải auto-bid)
 * Tích hợp WebSocket để real-time updates
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BidService {
    
    private final BidHistoryRepository bidHistoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BlockedBidderRepository blockedBidderRepository;
    private final RatingRepository ratingRepository;
    private final BidHistoryMapper bidHistoryMapper;
    private final WebSocketEventPublisher webSocketEventPublisher;

    /**
     * ĐẶT GIÁ THÔNG THƯỜNG (Manual Bidding)
     */
    @Transactional
    public PlaceBidResponse placeBid(UUID bidderId, PlaceBidRequest request) {
        log.info("Bidder {} đặt giá {} cho product {}", 
                bidderId, request.getGiaDat(), request.getProductId());

        // 1. VALIDATE BIDDER
        User bidder = userRepository.findById(bidderId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));

        // 2. VALIDATE PRODUCT
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm"));

        // 3. VALIDATE ĐIỀU KIỆN ĐẤU GIÁ
        validateBidConditions(bidder, product);

        // 4. VALIDATE GIÁ ĐẶT
        validateBidPrice(product, request.getGiaDat());

        // 5. CẬP NHẬT SẢN PHẨM
        product.setGiaHienTai(request.getGiaDat());
        product.setCurrentBidder(bidder);
        product.setSoLuotRaGia(product.getSoLuotRaGia() + 1);
        
        // Check auto-extend nếu gần hết hạn
        checkAndExtendAuction(product);
        
        product = productRepository.save(product);

        // 6. GHI LỊCH SỬ
        BidHistory bidHistory = BidHistory.builder()
                .product(product)
                .bidder(bidder)
                .giaDat(request.getGiaDat())
                .build();
        bidHistory = bidHistoryRepository.save(bidHistory);

        log.info("Đặt giá thành công - Product: {}, Giá: {}, Bidder: {}", 
                product.getProductid(), request.getGiaDat(), bidder.getUsername());

        // ⚡ BROADCAST REAL-TIME UPDATE
        webSocketEventPublisher.publishBidUpdate(product, "NEW_BID");
        webSocketEventPublisher.publishNewBidHistory(bidHistory);

        // 7. TẠO RESPONSE
        return PlaceBidResponse.builder()
                .success(true)
                .message("Đặt giá thành công")
                .bidHistory(bidHistoryMapper.toResponse(bidHistory))
                .giaHienTai(product.getGiaHienTai())
                .soLuotRaGia(product.getSoLuotRaGia())
                .isExtended(product.getThoiGianKetThuc().isAfter(
                        LocalDateTime.now().plusMinutes(5)))
                .build();
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
            if (!product.getChoPhepBidderChuaDanhGia()) {
                throw new ForbiddenException(
                        "Sản phẩm này không cho phép người chưa có đánh giá tham gia");
            }
            return;
        }

        // Nếu đã có đánh giá, check tỷ lệ >= 80%
        Double ratingPercentage = ratingRepository.calculateRatingPercentage(bidder.getUserid());
        if (ratingPercentage < 80.0) {
            throw new ForbiddenException(
                    String.format("Điểm đánh giá của bạn là %.1f%%, cần tối thiểu 80%% để tham gia",
                            ratingPercentage));
        }
    }

    /**
     * VALIDATE GIÁ ĐẶT
     */
    private void validateBidPrice(Product product, BigDecimal giaDat) {
        // Giá đặt phải >= giá hiện tại + bước giá
        BigDecimal minRequired = product.getGiaHienTai().add(product.getBuocGia());

        if (giaDat.compareTo(minRequired) < 0) {
            throw new IllegalArgumentException(
                    String.format("Giá đặt phải >= %s (giá hiện tại + bước giá)",
                            minRequired.toString()));
        }

        // Check giá mua ngay (nếu có)
        if (product.getGiaMuaNgay() != null && 
            giaDat.compareTo(product.getGiaMuaNgay()) >= 0) {
            throw new IllegalArgumentException(
                    "Giá đặt vượt quá giá mua ngay. Vui lòng sử dụng chức năng Mua Ngay");
        }
    }

    /**
     * CHECK VÀ GIA HẠN ĐẤU GIÁ TỰ ĐỘNG
     * Nếu có bid trong vòng 5 phút trước khi kết thúc, tự động gia hạn thêm 10 phút
     */
    private void checkAndExtendAuction(Product product) {
        if (!product.getChoPhepTuDongGiaHan()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endTime = product.getThoiGianKetThuc();
        
        // Nếu còn < 5 phút thì gia hạn thêm 10 phút
        if (endTime.minusMinutes(5).isBefore(now)) {
            product.setThoiGianKetThuc(now.plusMinutes(10));
            log.info("Product {} được gia hạn tự động đến {}", 
                    product.getProductid(), product.getThoiGianKetThuc());
        }
    }

    /**
     * MUA NGAY
     */
    @Transactional
    public PlaceBidResponse buyNow(UUID buyerId, Long productId) {
        log.info("User {} mua ngay product {}", buyerId, productId);

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm"));

        // Validate
        if (product.getGiaMuaNgay() == null) {
            throw new IllegalArgumentException("Sản phẩm không hỗ trợ mua ngay");
        }

        validateBidConditions(buyer, product);

        // Cập nhật product
        product.setGiaHienTai(product.getGiaMuaNgay());
        product.setCurrentBidder(buyer);
        product.setTrangThai(ProductStatus.COMPLETED);
        product.setThoiGianKetThuc(LocalDateTime.now());
        product = productRepository.save(product);

        // Ghi lịch sử
        BidHistory bidHistory = BidHistory.builder()
                .product(product)
                .bidder(buyer)
                .giaDat(product.getGiaMuaNgay())
                .build();
        bidHistory = bidHistoryRepository.save(bidHistory);

        // ⚡ BROADCAST
        webSocketEventPublisher.publishBidUpdate(product, "BUY_NOW");
        webSocketEventPublisher.publishProductStatusChange(
                product, "COMPLETED", "Sản phẩm đã được mua ngay");

        return PlaceBidResponse.builder()
                .success(true)
                .message("Mua ngay thành công")
                .bidHistory(bidHistoryMapper.toResponse(bidHistory))
                .giaHienTai(product.getGiaHienTai())
                .build();
    }

    /**
     * LẤY LỊCH SỬ ĐẤU GIÁ
     */
    public Page<@NotNull BidHistoryResponse> getBidHistory(Long productId, Pageable pageable) {
        return bidHistoryRepository
                .findByProductProductidOrderByThoiGianDatDesc(productId, pageable)
                .map(bidHistoryMapper::toResponse);
    }
}
