package com.example.backend.repository;

import com.example.backend.dto.admin.dashboard.CategoryDistribution;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductStatus;
import jakarta.persistence.LockModeType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("SELECT new com.example.backend.dto.admin.dashboard.CategoryDistribution(" +
            // 1. Logic ID: Nếu có cha (parent) thì lấy ID cha, không thì lấy ID chính nó (c)
            "   COALESCE(parent.categoryid, c.categoryid), " +

            // 2. Logic Tên: Tương tự, ưu tiên lấy tên cha
            "   COALESCE(parent.tenDanhMuc, c.tenDanhMuc), " +

            // 3. Đếm số sản phẩm
            "   COUNT(p) " +
            ") " +
            "FROM Product p " +
            "JOIN p.category c " +            // (1) Nối Product với Category hiện tại
            "LEFT JOIN c.parentCategory parent " + // (2) Nối tiếp Category với Parent của nó (Self-join)
            "GROUP BY " +
            "   COALESCE(parent.categoryid, c.categoryid), " +
            "   COALESCE(parent.tenDanhMuc, c.tenDanhMuc) " +
            "ORDER BY COUNT(p) DESC")
    List<CategoryDistribution> countProductsGroupedByRootCategory();

    @Query("SELECT p FROM Product p " +
            "JOIN p.category c " +
            "LEFT JOIN c.parentCategory pc " +
            "WHERE " +
            // 1. Logic Category: Thuộc chính nó HOẶC thuộc con của nó
            "   (c.categoryid = :rootCategoryId OR pc.categoryid = :rootCategoryId) " +
            "AND " +
            // 2. Logic Search: Nếu keyword null thì bỏ qua, nếu có thì tìm theo searchText
            "   (:keyword IS NULL OR p.searchText LIKE %:keyword%)")
    Page<@NotNull Product> findByRootCategoryAndSearch(
            @Param("rootCategoryId") Long rootCategoryId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // Top 10 sản phẩm giá cao nhất
    List<Product> findTop3ByTrangThaiOrderByGiaHienTaiDesc(ProductStatus status);

    // Top 10 sản phẩm nhiều lượt đấu giá nhất
    List<Product> findTop10ByTrangThaiOrderBySoLuotRaGiaDesc(ProductStatus status);
}
