package com.example.backend.repository;

import com.example.backend.entity.Transaction;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<@NotNull Transaction, @NotNull Long> {
    Page<@NotNull Transaction> findAllByBuyer_Userid(UUID buyerId, Pageable pageable);
    Page<@NotNull Transaction> findAllBySeller_Userid(UUID sellerId, Pageable pageable);
    Optional<Transaction> findByProduct_Productid(Long productId);

    @Query("SELECT COALESCE(SUM(t.giaCuoiCung), 0) FROM Transaction t " +
            "WHERE t.trangThai = 'COMPLETED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(t.giaCuoiCung), 0) FROM Transaction t " +
            "WHERE t.trangThai = 'COMPLETED' " +
            "AND t.thoiGianNhanHang >= :start AND t.thoiGianNhanHang < :end")
    BigDecimal sumRevenueByDateRange(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);


    @Query("SELECT COALESCE(SUM(t.giaCuoiCung), 0) FROM Transaction t " +
            "WHERE t.trangThai = 'COMPLETED' ")
    BigDecimal sumRevenue();
}
