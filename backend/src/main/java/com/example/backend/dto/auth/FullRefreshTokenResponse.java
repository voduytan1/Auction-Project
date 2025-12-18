package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FullRefreshTokenResponse {
    String accessToken;
    String refreshToken;
    long expiresIn;
}
