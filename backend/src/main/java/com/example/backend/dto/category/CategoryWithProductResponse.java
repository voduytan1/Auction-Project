package com.example.backend.dto.category;

import com.example.backend.dto.product.ProductResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryWithProductResponse {
    Long categoryid;
    String tenDanhMuc;

    // Thông tin danh mục cha (Flattening)
    Long parentCategoryId;
    String parentCategoryName;

    Integer level;
    String moTa;

    List<ProductResponse> products;
}
