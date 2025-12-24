package com.example.backend.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO cho real-time bid update qua WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidUpdateMessage {
    
    /**
     * ID sản phẩm
     */
    private Long productId;
    
    /**
     * Giá hiện tại mới
     */
    private BigDecimal giaHienTai;
    
    /**
     * Tên người đặt giá hiện tại (đã mask)
     */
    private String currentBidder;
    
    /**
     * Số lượt ra giá
     */
    private Integer soLuotRaGia;
    
    /**
     * Thời gian đặt giá
     */
    private LocalDateTime thoiGianDat;
    
    /**
     * Loại event: "NEW_BID", "AUTO_BID", "BUY_NOW"
     */
    private String eventType;
    
    /**
     * Thông báo cho người dùng
     */
    private String message;
}
