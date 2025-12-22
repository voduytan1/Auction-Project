package com.example.backend.repository;

import com.example.backend.entity.ProductDescriptionHistory;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDescriptionHistoryRepository extends JpaRepository<@NotNull ProductDescriptionHistory, @NotNull Long> {}