package com.example.backend.dto.bid;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceAutoBidRequest {
    @NotNull(message = "Product ID không được để trống")
    private Long productid;

    @NotNull(message = "Giá tối đa không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá tối đa phải lớn hơn 0")
    private BigDecimal giaToiDa;
}
