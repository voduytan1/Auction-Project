package com.example.backend.repository;

import com.example.backend.entity.UpgradeRequest;
import com.example.backend.entity.UpgradeRequestStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface UpgradeRequestRepository extends JpaRepository<@NotNull UpgradeRequest, @NotNull Long> {
    Optional<@NotNull UpgradeRequest> findByUser_Userid(@NotNull UUID id);

    @Query("SELECT u FROM UpgradeRequest u WHERE LOWER(u.user.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    Page<@NotNull UpgradeRequest> findAllByUser_UsernameContainingIgnoreCase(String username, Pageable pageable);
    Page<@NotNull UpgradeRequest> findAllByTrangThai(UpgradeRequestStatus upgradeRequestStatus, Pageable pageable);
    @Query("SELECT u FROM UpgradeRequest u WHERE " +
            "LOWER(u.user.username) LIKE LOWER(CONCAT('%', :username, '%')) " +
            "AND u.trangThai = :upgradeRequestStatus")
    Page<@NotNull UpgradeRequest> findAllByUser_UsernameContainingIgnoreCaseAndTrangThai(String username, UpgradeRequestStatus upgradeRequestStatus, Pageable pageable);

}


