package com.example.backend.repository;

import com.example.backend.entity.Product;
import com.example.backend.entity.ProductStatus;
import jakarta.persistence.LockModeType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<@NotNull Product, @NotNull Long>, JpaSpecificationExecutor<@NotNull Product> {
    @Lock(LockModeType.PESSIMISTIC_WRITE) // Chặn các thread khác đọc/ghi dòng này
    @Query("SELECT p FROM Product p WHERE p.productid = :id")
    Optional<Product> findByIdForUpdate(Long id);

    Long countByTrangThai(ProductStatus status);

    // Đếm theo thời gian tạo
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countByThoiGianKetThucBetween(LocalDateTime start, LocalDateTime end);
    // Đếm theo status và thời gian update
    Long countByTrangThaiAndCreatedAtBetween(
            ProductStatus status, LocalDateTime start, LocalDateTime end
    );
    Long countByTrangThaiAndUpdatedAtBetween(
            ProductStatus status, LocalDateTime start, LocalDateTime end
    );

    // Đếm active products tạo trước thời điểm
    Long countByTrangThaiAndCreatedAtLessThanEqual(
            ProductStatus status, LocalDateTime end
    );

    // Đếm sản phẩm theo category
    @Query("SELECT p.category.categoryid, p.category.tenDanhMuc, COUNT(p) " +
            "FROM Product p GROUP BY p.category.categoryid, p.category.tenDanhMuc " +
            "ORDER BY COUNT(p) DESC")
    List<Object[]> countProductsByCategory();

    // Top 10 sản phẩm giá cao nhất
    List<Product> findTop10ByTrangThaiOrderByGiaHienTaiDesc(ProductStatus status);

    // Top 10 sản phẩm nhiều lượt đấu giá nhất
    List<Product> findTop10ByTrangThaiOrderBySoLuotRaGiaDesc(ProductStatus status);
}
