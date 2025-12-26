package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenInfo {
    private String jti;
    private String userId;
}
