package com.example.backend.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho response đặt giá thông thường
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceBidResponse {
    
    private Boolean success;
    private String message;
    private BidHistoryResponse bidHistory;
    private BigDecimal giaHienTai;
    private Integer soLuotRaGia;
    private Boolean isExtended; // Sản phẩm có được gia hạn không
}
