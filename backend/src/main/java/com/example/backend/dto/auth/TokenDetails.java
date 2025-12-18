package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class TokenDetails {
    String token;
    Instant expiresAt;
}
