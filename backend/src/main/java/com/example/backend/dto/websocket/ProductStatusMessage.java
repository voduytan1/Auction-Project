package com.example.backend.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho product status update qua WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatusMessage {
    
    /**
     * ID sản phẩm
     */
    private Long productId;
    
    /**
     * Trạng thái mới: ACTIVE, COMPLETED, CANCELLED, etc.
     */
    private String status;
    
    /**
     * Thông báo
     */
    private String message;
    
    /**
     * ID người thắng (nếu có)
     */
    private String winnerId;
    
    /**
     * Tên người thắng (đã mask)
     */
    private String winnerName;
}
