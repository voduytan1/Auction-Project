package com.example.backend.controller;

import com.example.backend.dto.auth.*;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.mapper.AuthMapper;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
import com.example.backend.service.RecaptchaService;
import com.example.backend.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    private final AuthMapper authMapper;

    private final CookieUtils cookieUtils;

    private final RecaptchaService recaptchaService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {

        boolean isCaptchaValid = recaptchaService.validateToken(loginRequest.getRecaptchaToken());

        if (!isCaptchaValid) {
            throw new IllegalArgumentException("Captcha không hợp lệ hoặc đã hết hạn!");
        }

        LoginResponseWithRefreshToken fullResponse = authService.login(loginRequest);

        cookieUtils.setRefreshTokenCookie(response, fullResponse.getRefreshToken());

        return ApiResponse.success(authMapper.toLoginResponse(fullResponse));
    }

    @PostMapping("/refresh")
    public  ApiResponse<RefreshTokenResponse> refresh(@CookieValue("refresh_token") String refreshToken, HttpServletRequest request, HttpServletResponse response) {
        FullRefreshTokenResponse result = authService.refreshToken(refreshToken);
        cookieUtils.setRefreshTokenCookie(response, result.getRefreshToken());

        return ApiResponse.success(authMapper.toRefreshTokenResponse(result));
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

    @PatchMapping("/forgot-password")
    public ApiResponse<LoginResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest forgotPasswordRequest, HttpServletRequest request, HttpServletResponse response) {
        boolean isCaptchaValid = recaptchaService.validateToken(forgotPasswordRequest.getRecaptchaToken());

        if (!isCaptchaValid) {
            throw new IllegalArgumentException("Captcha không hợp lệ hoặc đã hết hạn!");
        }

        LoginResponseWithRefreshToken fullResponse = authService.forgotPassword(forgotPasswordRequest);

        cookieUtils.setRefreshTokenCookie(response, fullResponse.getRefreshToken());

        return ApiResponse.success(authMapper.toLoginResponse(fullResponse));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        // Giả sử logic sinh OTP ngẫu nhiên
        String randomOtp = String.valueOf((int)(Math.random() * 900000) + 100000);

        // Gửi mail
        emailService.sendOtpEmail(email, randomOtp);

        return ResponseEntity.ok("OTP đã được gửi tới email: " + email);
    }
}