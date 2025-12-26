package com.example.backend.repository;

import com.example.backend.entity.Product;
import jakarta.persistence.LockModeType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<@NotNull Product, @NotNull Long>, JpaSpecificationExecutor<@NotNull Product> {
    @Lock(LockModeType.PESSIMISTIC_WRITE) // Chặn các thread khác đọc/ghi dòng này
    @Query("SELECT p FROM Product p WHERE p.productid = :id")
    Optional<Product> findByIdForUpdate(Long id);
}
