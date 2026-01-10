package com.example.backend.repository;

import com.example.backend.entity.Product;
import com.example.backend.entity.ProductDescriptionHistory;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDescriptionHistoryRepository extends JpaRepository<@NotNull ProductDescriptionHistory, @NotNull Long> {
    List<ProductDescriptionHistory> findByProduct_Productid(Long  productId);
    List<ProductDescriptionHistory> findByProductProductidOrderByThoiGianThemAsc(Long productId);
}