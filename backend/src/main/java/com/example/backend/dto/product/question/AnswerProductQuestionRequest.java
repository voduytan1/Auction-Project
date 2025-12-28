package com.example.backend.dto.product.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnswerProductQuestionRequest {
    @NotNull(message = "Vui lòng nhập id sản phẩm")
    Long productId;

    @NotBlank(message = "Vui lòng nhập nội dung câu trả lời")
    String noiDungTraLoi;

}
