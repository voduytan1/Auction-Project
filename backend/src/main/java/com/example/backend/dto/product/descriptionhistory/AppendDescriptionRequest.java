package com.example.backend.dto.product.descriptionhistory;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppendDescriptionRequest {
    @NotBlank(message = "Nội dung bổ sung không được để trống")
    private String content;
}
