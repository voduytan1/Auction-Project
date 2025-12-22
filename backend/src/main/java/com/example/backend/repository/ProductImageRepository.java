package com.example.backend.repository;

import com.example.backend.entity.ProductImage;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<@NotNull ProductImage, @NotNull Long> {
    void deleteAllByProduct_Productid(Long productid);
}
