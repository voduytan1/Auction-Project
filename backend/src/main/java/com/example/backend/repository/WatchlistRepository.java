package com.example.backend.repository;

import com.example.backend.entity.WatchList;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchlistRepository extends JpaRepository<@NotNull WatchList, @NotNull Long> {
    List<WatchList> findByUser_Userid(UUID userId);

    Optional<@NotNull WatchList> findByUser_UseridAndProduct_Productid(UUID userId, Long productId);
    Boolean existsByUser_UseridAndProduct_Productid(UUID userId, Long productId);
}
