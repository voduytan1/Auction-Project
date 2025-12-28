package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
// "otp_sessions" là tên key prefix trong Redis
// timeToLive = 300: Mặc định sống 5 phút (300 giây)
@RedisHash(value = "otp_sessions", timeToLive = 300)
public class OTP implements Serializable {

    @Id
    private String email; // Key chính sẽ là userId (email hoặc id)

    private String otpCode;

    @TimeToLive
    private Long timeToLive; // Field này dùng để override thời gian sống nếu muốn set động
}
