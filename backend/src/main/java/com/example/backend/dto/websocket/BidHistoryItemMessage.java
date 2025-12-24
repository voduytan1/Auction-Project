package com.example.backend.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO cho bid history item trong real-time updates
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidHistoryItemMessage {
    
    /**
     * ID bid history
     */
    private Long bidHistoryId;
    
    /**
     * ID sản phẩm
     */
    private Long productId;
    
    /**
     * Tên người đặt giá (đã mask)
     */
    private String bidderName;
    
    /**
     * Giá đặt
     */
    private BigDecimal giaDat;
    
    /**
     * Thời gian đặt
     */
    private LocalDateTime thoiGianDat;
}
