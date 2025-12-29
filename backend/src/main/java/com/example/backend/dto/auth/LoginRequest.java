package com.example.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "username không được rỗng")
    private String username;
    @NotBlank(message = "password không được rỗng")
    private String password;
    @NotBlank(message = "recaptcha token không được rỗng")
    private String recaptchaToken;
}