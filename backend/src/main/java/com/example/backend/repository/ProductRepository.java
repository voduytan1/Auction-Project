package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<@NotNull Product, @NotNull Long>, JpaSpecificationExecutor<@NotNull Product> {
}
