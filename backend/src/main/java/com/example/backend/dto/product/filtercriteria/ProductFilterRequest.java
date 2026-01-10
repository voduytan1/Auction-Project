package com.example.backend.dto.product.filtercriteria;

import com.example.backend.entity.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFilterRequest {
    String keyword;
    Long categoryId;
    Long excludeId;
    BigDecimal minPrice;
    BigDecimal maxPrice;
    ProductStatus status;
    UUID sellerId;
}
