package com.example.backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.backend.entity.BidHistory;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface BidHistoryRepository extends JpaRepository<@NotNull BidHistory, @NotNull Long> {
    Page<BidHistory> findByProductProductidOrderByCreatedAtDesc(Long productid, Pageable pageable);

    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Modifying
    @Transactional
    @Query("DELETE FROM BidHistory b WHERE b.product.productid = :productId AND b.bidder.userid = :userId")
    void deleteAllByProductAndBidder(Long productId, UUID userId);
}
