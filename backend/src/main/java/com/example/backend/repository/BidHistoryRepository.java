package com.example.backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.backend.entity.BidHistory;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidHistoryRepository extends JpaRepository<@NotNull BidHistory, @NotNull Long> {
    Page<BidHistory> findByProductProductidOrderByCreatedAtDesc(Long productid, Pageable pageable);
}
