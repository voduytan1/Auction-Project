package com.example.backend.dto.auth;

import com.example.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseWithRefreshToken {
    private String accessToken;
    private String refreshToken;
    private String userid;
    private String username;
    private Role vaitro;
    private String maKhoa;
    private String avatar;
    private String email;
}