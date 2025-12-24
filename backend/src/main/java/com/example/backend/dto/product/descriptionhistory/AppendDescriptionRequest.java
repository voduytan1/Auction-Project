package com.example.backend.dto.product.descriptionhistory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppendDescriptionRequest {
    @NotBlank(message = "Nội dung bổ sung không được để trống")
    private String noiDungThem;
    @NotNull(message = "Vui lòng cung cấp id của sản phẩm")
    private Long productId;
}
