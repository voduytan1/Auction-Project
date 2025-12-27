package com.example.backend.dto.product;

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
    private Integer soLuotRaGia;

    private LocalDateTime createdAt;
    private LocalDateTime thoiGianKetThuc;

    private ProductStatus trangThai;

    private Long categoryId;
    private String tenDanhMuc;
    private Long parentCategoryId;
    private String tenDanhMucCha;

    private String sellerId;
    private String tenSeller;
    private Double diemDanhGiaSeller;
    private String anhDaiDienSeller;

    private String bidderId;
    private String tenBidder;
    private Double diemDanhGiaBidder;

    private Long transactionId;

    private List<String> images;
}