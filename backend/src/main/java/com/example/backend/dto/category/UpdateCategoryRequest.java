package com.example.backend.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCategoryRequest {

    @Size(max = 100, message = "Tên danh mục không được quá 100 ký tự")
    String tenDanhMuc;

    Long parentCategoryId;

    String moTa;
}