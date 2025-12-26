package com.example.backend.controller;

import com.example.backend.dto.auth.*;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.mapper.AuthMapper;
import com.example.backend.service.AuthService;
import com.example.backend.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    private final AuthMapper authMapper;

    private final CookieUtils cookieUtils;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {

        LoginResponseWithRefreshToken fullResponse = authService.login(loginRequest);

        cookieUtils.setRefreshTokenCookie(response, fullResponse.getRefreshToken());

        return ApiResponse.success(authMapper.toLoginResponse(fullResponse));
    }

    @PostMapping("/refresh")
    public  ApiResponse<RefreshTokenResponse> refresh(@CookieValue("refresh_token") String refreshToken, HttpServletRequest request, HttpServletResponse response) {
        FullRefreshTokenResponse result = authService.refreshToken(refreshToken);
        cookieUtils.setRefreshTokenCookie(response, result.getRefreshToken());

        return ApiResponse.success(new RefreshTokenResponse(result.getAccessToken(), result.getExpiresIn()));
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse res) {

        cookieUtils.clearRefreshCookie(res);

        if (refreshToken != null && !refreshToken.isEmpty()) {
            authService.logout(refreshToken);
        }

        return ApiResponse.success("Log out successfully");
    }
}