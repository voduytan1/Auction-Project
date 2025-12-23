package com.example.backend.dto.product;

import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long productid;

    private String tenSanPham;
    private String moTa;

    private BigDecimal giaKhoiDiem;
    private BigDecimal buocGia;
    private BigDecimal giaHienTai;
    private BigDecimal giaMuaNgay;

    private LocalDateTime createdAt;
    private LocalDateTime thoiGianKetThuc;

    private ProductStatus trangThai;

    private String tenCategory;
    private String tenSeller;

    private List<String> images;
    private List<DescriptionHistoryResponse> descriptionUpdates;
}