package com.example.backend.dto.product;

import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal priceStart;
    private BigDecimal priceCurrent;
    private BigDecimal priceBuyNow;
    private LocalDateTime createdAt;
    private LocalDateTime endAt;
    private ProductStatus status;

    private String categoryName;
    private String sellerName;

    private List<String> images;
    private List<DescriptionHistoryResponse> descriptionUpdates;
}