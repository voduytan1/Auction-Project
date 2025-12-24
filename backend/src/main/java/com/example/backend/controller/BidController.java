package com.example.backend.controller;

import com.example.backend.dto.bid.*;
import com.example.backend.service.AutoBidService;
import com.example.backend.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller xử lý các chức năng đấu giá
 * - Đấu giá thông thường
 * - Đấu giá tự động (Auto-bid)
 * - Mua ngay
 * - Lịch sử đấu giá
 */
@RestController
@RequestMapping("/api/v1/bids")
@RequiredArgsConstructor
@Slf4j
public class BidController {

    private final BidService bidService;
    private final AutoBidService autoBidService;

    /**
     * ĐẶT GIÁ THÔNG THƯỜNG
     * POST /api/v1/bids
     */
    @PostMapping
    public ResponseEntity<PlaceBidResponse> placeBid(
            @Valid @RequestBody PlaceBidRequest request,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        PlaceBidResponse response = bidService.placeBid(userId, request);
        
        return ResponseEntity.ok(response);
    }

    /**
     * ĐẶT GIÁ TỰ ĐỘNG (AUTO-BID)
     * POST /api/v1/bids/auto
     */
    @PostMapping("/auto")
    public ResponseEntity<PlaceAutoBidResponse> placeAutoBid(
            @Valid @RequestBody PlaceAutoBidRequest request,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        PlaceAutoBidResponse response = autoBidService.placeAutoBid(userId, request);
        
        return ResponseEntity.ok(response);
    }

    /**
     * MUA NGAY
     * POST /api/v1/bids/buy-now/{productId}
     */
    @PostMapping("/buy-now/{productId}")
    public ResponseEntity<PlaceBidResponse> buyNow(
            @PathVariable Long productId,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        PlaceBidResponse response = bidService.buyNow(userId, productId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * LẤY LỊCH SỬ ĐẤU GIÁ CỦA SẢN PHẨM
     * GET /api/v1/bids/history/{productId}
     */
    @GetMapping("/history/{productId}")
    public ResponseEntity<Page<@NotNull BidHistoryResponse>> getBidHistory(
            @PathVariable Long productId,
            @PageableDefault(size = 20, sort = "thoiGianDat", direction = Sort.Direction.DESC) 
            Pageable pageable) {
        
        Page<BidHistoryResponse> history = bidService.getBidHistory(productId, pageable);
        return ResponseEntity.ok(history);
    }

    /**
     * LẤY DANH SÁCH AUTO-BID CỦA TÔI
     * GET /api/v1/bids/auto/my
     */
    @GetMapping("/auto/my")
    public ResponseEntity<List<AutoBidResponse>> getMyAutoBids(
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        List<AutoBidResponse> autoBids = autoBidService.getMyAutoBids(userId);
        
        return ResponseEntity.ok(autoBids);
    }

    /**
     * HỦY AUTO-BID
     * DELETE /api/v1/bids/auto/{autoBidId}
     */
    @DeleteMapping("/auto/{autoBidId}")
    public ResponseEntity<Void> cancelAutoBid(
            @PathVariable Long autoBidId,
            Authentication authentication) {
        
        UUID userId = UUID.fromString(authentication.getName());
        autoBidService.cancelAutoBid(userId, autoBidId);
        
        return ResponseEntity.noContent().build();
    }
}
