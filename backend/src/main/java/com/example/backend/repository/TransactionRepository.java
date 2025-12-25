package com.example.backend.repository;

import com.example.backend.entity.Transaction;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<@NotNull Transaction, @NotNull Long> {
    Page<@NotNull Transaction> findAllByBuyer_Userid(UUID buyerId, Pageable pageable);
    Page<@NotNull Transaction> findAllBySeller_Userid(UUID sellerId, Pageable pageable);

}
