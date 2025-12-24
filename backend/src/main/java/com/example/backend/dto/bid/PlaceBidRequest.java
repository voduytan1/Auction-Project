package com.example.backend.dto.bid;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO cho request đặt giá thông thường
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceBidRequest {
    
    @NotNull(message = "Product ID không được để trống")
    private Long productId;
    
    @NotNull(message = "Giá đặt không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá đặt phải > 0")
    private BigDecimal giaDat;
}
