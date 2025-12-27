package com.example.backend.dto.product.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateProductQuestionRequest {
    @NotNull(message = "Vui lòng nhập id sản phẩm")
    Long productId;

    @NotBlank(message = "Vui lòng nhập nội dung câu hỏi")
    String noiDungCauHoi;
}
