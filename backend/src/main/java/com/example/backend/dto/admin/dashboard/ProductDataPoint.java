package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDataPoint {
    private int month;
    private Long newProduct;
    private Long completedProduct;
}
