package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class CategoryDistribution {
    private Long categoryId;
    private String tenDanhMuc;
    private Long soLuongSanPham;
    public CategoryDistribution(Long categoryId, String tenDanhMuc, Long soLuongSanPham) {
        this.categoryId = categoryId;
        this.tenDanhMuc = tenDanhMuc;
        this.soLuongSanPham = soLuongSanPham;
    }
    public CategoryDistribution(Object categoryId, String tenDanhMuc, Long soLuongSanPham) {
        if (categoryId instanceof Number) {
            this.categoryId = ((Number) categoryId).longValue();
        } else {
            this.categoryId = null; // Hoặc xử lý tùy ý
        }
        this.tenDanhMuc = tenDanhMuc;
        this.soLuongSanPham = soLuongSanPham;
    }
}
