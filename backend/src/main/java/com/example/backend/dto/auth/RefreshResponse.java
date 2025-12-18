package com.example.backend.dto.auth;

public class RefreshResponse {
    private String accessToken;
    private String token_type = "Bearer";
    private long expires_in;
}