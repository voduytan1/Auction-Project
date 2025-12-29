package com.example.backend.dto.user;

import com.example.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    String oldPassword;

    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    String newPassword;

    @Email(message = "Email không đúng định dạng")
    String email;

    Role vaitro;

    @Size(max = 100, message = "Họ và tên không quá 100 ký tự")
    String hoVaTen;

    @Size(max = 255, message = "Địa chỉ không quá 255 ký tự")
    String diaChi;

    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải bao gồm 10 chữ số")
    String soDienThoai;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    LocalDate ngaySinh;

    String anhDaiDien;
}