package com.example.backend.dto.user;

import com.example.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    String password;

    @Email(message = "Email không đúng định dạng")
    String email;

    Role vaitro;

    @Size(max = 100, message = "Họ và tên không quá 100 ký tự")
    String hoVaTen;

    @Size(max = 50, message = "Chức vụ không quá 50 ký tự")
    String chucVu;

    @Size(min = 3, max = 3, message = "Mã khoa phải đúng 3 ký tự")
    String maKhoa;

    Boolean deleteKhoa = false;

    String anhDaiDien;
}