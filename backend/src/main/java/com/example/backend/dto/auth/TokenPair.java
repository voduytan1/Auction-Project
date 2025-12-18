package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class TokenPair {
    private String accessToken;
    private String refreshToken;
    Instant refreshTokenExpirationTime;
    Instant accessTokenExpirationTime;
    private String jti;
}
