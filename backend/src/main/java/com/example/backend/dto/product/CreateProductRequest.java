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
    String tenSanPham;

    @NotBlank(message = "Mô tả không được để trống")
    String moTa;

    @NotNull(message = "Giá khởi điểm không được để trống")
    @Min(value = 1000, message = "Giá khởi điểm tối thiểu là 1000 VNĐ")
    BigDecimal giaKhoiDiem;

    @NotNull(message = "Bước giá không được để trống")
    @Min(value = 1000, message = "Bước giá tối thiểu là 1000 VNĐ")
    BigDecimal buocGia;

    BigDecimal giaMuaNgay;

    @NotNull(message = "Vui lòng chọn danh mục")
    Long categoryId;

    @NotNull(message = "Thời gian tối thiểu là 1 giờ")
    @Min(value = 1, message = "Thời gian tối thiểu là 1 giờ")
    Integer durationInHours;

    @NotEmpty(message = "Vui lòng tải lên tối thiểu 4 ảnh")
    @Size(min = 3, message = "Vui lòng tải lên tối thiểu 4 ảnh")
    List<String> images;

    Boolean choPhepTuDongGiaHan = false;

    Boolean choPhepBidderChuaDanhGia = true;
}
