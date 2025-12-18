package com.example.backend.dto.user;

import com.example.backend.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    UUID id;

    String username;

    String email;

    Role vaitro;

    String hoVaTen;

    String chucVu;

    String maKhoa;

    String anhDaiDien;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
