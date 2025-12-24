package com.example.backend.dto.rating;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRatingRequest {
    @NotNull(message = "Product ID không được để trống")
    private Long productid;

    @NotNull(message = "Ratee ID (người được đánh giá) không được để trống")
    private UUID rateeid;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = -1, message = "Điểm chỉ có thể là +1 hoặc -1")
    @Max(value = 1, message = "Điểm chỉ có thể là +1 hoặc -1")
    private Integer diem; // +1 hoặc -1

    @NotBlank(message = "Nhận xét không được để trống")
    private String nhanXet;
}
