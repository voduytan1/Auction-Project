package com.example.backend.repository;

import com.example.backend.entity.JWTToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RedisRepository extends CrudRepository<JWTToken, String> {
    Optional<JWTToken> findByUserId(String userid);
    void deleteByUserId(String userid);
}