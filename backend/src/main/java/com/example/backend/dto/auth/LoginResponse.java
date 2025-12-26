package com.example.backend.dto.auth;

import com.example.backend.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
    String accessToken;

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