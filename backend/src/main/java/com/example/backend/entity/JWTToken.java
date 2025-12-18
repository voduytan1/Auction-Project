package com.example.backend.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import java.time.Instant;
@RedisHash("jwt:token")
@Data
@Builder
public class JWTToken {
    @Id
    private String jti;

    @Indexed
    private String userId;

    private String accessToken;

    private String refreshToken;

    private Instant expiresAt;

    @TimeToLive
    private Long timeToLive; //Seconds
}