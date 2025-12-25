package com.example.backend.repository;

import com.example.backend.entity.Transaction;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<@NotNull Transaction, @NotNull Long> {
}
