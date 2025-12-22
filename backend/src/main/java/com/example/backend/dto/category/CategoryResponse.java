package com.example.backend.dto.category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Long categoryid;
    String tenDanhMuc;

    // Thông tin danh mục cha (Flattening)
    Long parentCategoryId;
    String parentCategoryName;

    Integer level;
    String moTa;
}