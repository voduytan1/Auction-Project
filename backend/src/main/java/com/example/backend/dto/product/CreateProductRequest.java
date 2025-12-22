package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotNull(message = "iá khởi điểm tối thiểu là 1000 VNĐ")
    @Min(value = 1000, message = "Giá khởi điểm tối thiểu là 1000 VNĐ")
    private BigDecimal priceStart;

    @NotNull(message = "Bước giá tối thiểu là 1000 VNĐ")
    @Min(value = 1000, message = "Bước giá tối thiểu là 1000 VNĐ")
    private BigDecimal priceStep;

    private BigDecimal priceBuyNow;

    @NotNull(message = "Vui lòng chọn danh mục")
    private Long categoryId;

    @NotNull(message = "Thời gian tối thiểu là 1 giờ")
    @Min(value = 1, message = "Thời gian tối thiểu là 1 giờ")
    private Integer durationInHours; // User nhập số giờ muốn đấu giá (ví dụ: 24h, 48h)

    @NotEmpty(message = "Vui lòng tải lên tối thiểu 3 ảnh")
    @Size(min = 3, message = "Vui lòng tải lên tối thiểu 3 ảnh")
    private List<String> imageUrls;
}
