package com.example.backend.repository;


import com.example.backend.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
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
    Page<User> findUsersWithSearch(@Param("search") String search, Pageable pageable);

    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
