package com.example.backend.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtils {

    @Value("${jwt.refreshToken.expirationTime}")
    private int refreshTokenExpirationTime;

    public void setRefreshTokenCookie(HttpServletResponse res, String value) {
        Cookie cookie = new Cookie("refresh_token", value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(refreshTokenExpirationTime*24*60*60);
        res.addCookie(cookie);
    }

    public void clearRefreshCookie(HttpServletResponse res) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(0);
        res.addCookie(cookie);
    }
}