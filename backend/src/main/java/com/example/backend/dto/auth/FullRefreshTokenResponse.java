package com.example.backend.dto.auth;

import com.example.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class FullRefreshTokenResponse {
    String accessToken;
    String refreshToken;
    long expiresIn;

    String userid;

    String username;

    String email;

    Role vaitro;

    LocalDateTime thoiHanBanHang;

    String hoVaTen;

    String diaChi;

    String soDienThoai;

    LocalDate ngaySinh;

    Double diemDanhGia;

    Integer soLuongDanhGia;

    String anhDaiDien;
}
