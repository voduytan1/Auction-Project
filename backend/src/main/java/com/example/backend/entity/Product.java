
package com.example.backend.entity;

import com.example.backend.utils.MyStringUtils;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_status", columnList = "trang_thai"),
        @Index(name = "idx_product_end_time", columnList = "thoi_gian_ket_thuc"),
        @Index(name = "idx_product_created", columnList = "created_at"),
        @Index(name = "idx_product_category", columnList = "categoryid"),
        @Index(name = "idx_product_seller", columnList = "sellerid"),
        @Index(name = "idx_product_search_text", columnList = "search_text")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productid")
    Long productid;

    @Column(name = "ten_san_pham", length = 255, nullable = false, columnDefinition = "nvarchar(255)")
    String tenSanPham;

    @Column(name = "mo_ta", columnDefinition = "MEDIUMTEXT")
    String moTa;

    @Column(name = "gia_khoi_diem", precision = 15, scale = 2, nullable = false)
    BigDecimal giaKhoiDiem;

    @Column(name = "buoc_gia", precision = 15, scale = 2, nullable = false)
    BigDecimal buocGia;

    @Column(name = "gia_hien_tai", precision = 15, scale = 2, nullable = false)
    BigDecimal giaHienTai;

    @Column(name = "gia_mua_ngay", precision = 15, scale = 2)
    BigDecimal giaMuaNgay;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<ProductImage> images = new ArrayList<>();

    @Column(name = "cho_phep_tu_dong_gia_han", nullable = false)
    Boolean choPhepTuDongGiaHan = false;

    @Column(name = "cho_phep_bidder_chua_danh_gia", nullable = false)
    Boolean choPhepBidderChuaDanhGia = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    ProductStatus trangThai = ProductStatus.PENDING;

    @Column(name = "thoi_gian_ket_thuc", nullable = false)
    LocalDateTime thoiGianKetThuc;

    @Column(name = "so_luot_ra_gia")
    Integer soLuotRaGia = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryid", nullable = false)
    Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid", nullable = false)
    User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_bidderid")
    User currentBidder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "search_text", columnDefinition = "TEXT")
    private String searchText;

    @PrePersist // Chạy trước khi INSERT
    @PreUpdate  // Chạy trước khi UPDATE
    public void generateSearchText() {
        // Gom tất cả các thuộc tính muốn search vào đây (Tên + Mô tả + ...)
        String rawText = this.tenSanPham + " " + (this.moTa != null ? this.moTa : "");

        // Gọi hàm bỏ dấu và lưu vào cột search_text
        this.searchText = MyStringUtils.removeAccents(rawText);
    }
}
