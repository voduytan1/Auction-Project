package com.example.backend.dto.auth;

import com.example.backend.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponseWithRefreshToken {
    String accessToken;

    String refreshToken;

    String userid;

    String username;

    String email;

    Role vaitro;

    String hoVaTen;

    String diaChi;

    String soDienThoai;

    LocalDate ngaySinh;

    String anhDaiDien;
}