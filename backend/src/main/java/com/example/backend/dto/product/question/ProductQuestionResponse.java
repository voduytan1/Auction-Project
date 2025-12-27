package com.example.backend.dto.product.question;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductQuestionResponse {
    Long questionId;

    Long productId;

    UUID askerId;
    String tenNguoiHoi;
    String anhDaiDienNguoiHoi;
    Double diemDanhGiaNguoiHoi;

    String noiDungCauHoi;

    String noiDungTraLoi;

    LocalDateTime thoiGianHoi;

    LocalDateTime thoiGianTraLoi;
}
