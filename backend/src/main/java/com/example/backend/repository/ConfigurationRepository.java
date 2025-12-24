package com.example.backend.repository;

import com.example.backend.entity.ConfigVariable;
import com.example.backend.entity.Configuration;
import org.jetbrains.annotations.NotNull;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfigurationRepository extends JpaRepository<@NotNull Configuration, @NotNull Long> {
    Optional<Configuration> findByVariable(@NotNull ConfigVariable variable);
}
