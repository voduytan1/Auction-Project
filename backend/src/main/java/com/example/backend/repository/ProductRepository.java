package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<@NotNull Product, @NotNull Long> {
}
