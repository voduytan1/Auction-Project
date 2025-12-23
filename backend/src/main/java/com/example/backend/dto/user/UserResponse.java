package com.example.backend.dto.user;

import com.example.backend.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    UUID userid;

    String username;

    String email;

    Role vaitro;

    LocalDateTime thoiHanBanHang;

    String hoVaTen;

    String diaChi;

    String soDienThoai;

    LocalDate ngaySinh;

    String anhDaiDien;

    Double diemDanhGia;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
