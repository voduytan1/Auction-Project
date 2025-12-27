package com.example.backend.dto.product;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductIdRequest {
    @NotNull(message = "Vui lòng không bỏ trống id sản phẩm")
    Long productId;
}
