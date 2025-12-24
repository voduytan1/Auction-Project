package com.example.backend.dto.product.descriptionhistory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DescriptionHistoryResponse {
    private Long id;
    private Long productId;
    private String noiDungThem;
    private LocalDateTime thoiGianThem;
}