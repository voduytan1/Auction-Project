package com.example.backend.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
public class CreateCategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không được quá 100 ký tự")
    String tenDanhMuc;

    Long parentCategoryId;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    String moTa;
}
