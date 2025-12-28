package com.example.backend.repository;


import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<@NotNull User, @NotNull UUID> {
    Optional<User> findUserByUsername(String username);
    Optional<User> findUserByEmail(String email);

    @Query(value = "SELECT u FROM User u WHERE " +
            ":search IS NULL OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))",
            countQuery = "SELECT COUNT(u) FROM User u WHERE " +
                    ":search IS NULL OR " +
                    "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<@NotNull User> findUsersWithSearch(@Param("search") String search, Pageable pageable);

    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.vaitro = 'BIDDER', u.thoiHanBanHang = NULL " +
            "WHERE u.vaitro = 'SELLER' " +
            "AND (u.thoiHanBanHang IS NULL OR u.thoiHanBanHang < :now)")
    int revokeExpiredSellers(@Param("now") LocalDateTime now);

    Long countByVaitro(Role vaitro);

    // Đếm user mới theo thời gian
    Long countByVaitroAndCreatedAtBetween(Role vaitro, LocalDateTime start, LocalDateTime end);

    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}
