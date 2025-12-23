package com.example.backend.dto.user;

import com.example.backend.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
public class CreateUserRequest {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    String email;

    Role vaitro = Role.BIDDER;

    @Size(max = 100, message = "Họ và tên không quá 100 ký tự")
    String hoVaTen;

    @Size(max = 255, message = "Địa chỉ không quá 255 ký tự")
    String diaChi;

    // Kiểm tra số điện thoại có đúng 10 chữ số không
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải bao gồm 10 chữ số")
    String soDienThoai;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    LocalDate ngaySinh;

    String anhDaiDien;
}