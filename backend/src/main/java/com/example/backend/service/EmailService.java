package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private RedisService redisService;

    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        redisService.saveOtp(toEmail, otpCode);
        message.setFrom("email_cua_ban@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Mã xác thực OTP của bạn");
        message.setText("Mã OTP của bạn là: " + otpCode + ". Mã này có hiệu lực trong 5 phút.");

        javaMailSender.send(message);
        System.out.println("Đã gửi OTP thành công!");
    }
}
