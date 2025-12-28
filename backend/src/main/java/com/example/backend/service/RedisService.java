package com.example.backend.service;

import com.example.backend.dto.auth.TokenPair;
import com.example.backend.entity.JWTToken;
import com.example.backend.entity.OTP;
import com.example.backend.mapper.JWTTokenMapper;
import com.example.backend.repository.OTPRepository;
import com.example.backend.repository.RedisRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class RedisService {

    private final RedisRepository  redisRepository;
    private final OTPRepository otpRepository;
//    public void saveToken(String jti, String userId, String accessToken, String refreshToken, long durationInSeconds, String ip) {
//        JWTToken token = JWTToken.builder()
//                .jti(jti) // ID duy nhất của token (thường lấy từ claim 'jti' của JWT)
//                .userId(userId)
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .ipAddress(ip)
//                .expiresAt(Instant.now().plusSeconds(durationInSeconds))
//                .timeToLive(durationInSeconds) // Redis sẽ tự xóa sau số giây này
//                .build();
//
//        redisRepository.save(token);
//        log.info("Lưu JWTToken thành công vào Redis cho User: {}", userId);
//    }
    public JWTToken getToken(String jti) {
        return redisRepository.findById(jti).orElse(null);
    }

    /**
     * Xóa token khi người dùng đăng xuất
     */
    @Transactional
    public void deleteToken(String jti) {
        redisRepository.deleteById(jti);
    }

    @Transactional
    public void createAndSaveJwtToken(TokenPair tokenPair, String userId,
                                      JWTTokenMapper jwtTokenMapper, RedisRepository redisRepository) {
        JWTToken jwtToken = jwtTokenMapper.toEntity(tokenPair);
        jwtToken.setUserId(userId);
        jwtToken.setTimeToLive(ChronoUnit.SECONDS.between(Instant.now(), jwtToken.getExpiresAt()));

        redisRepository.save(jwtToken);
    }

    public Optional<JWTToken> findByUserId(String userId){
        return redisRepository.findById(userId);
    }

    public void saveOtp(String email, String otpCode) {
        OTP otpRedis = OTP.builder()
                .email(email)
                .otpCode(otpCode)
                .timeToLive(300L) // Set cứng 300s (5 phút) hoặc lấy từ config
                .build();

        otpRepository.save(otpRedis);
        log.info("Đã lưu OTP vào Redis cho User: {}", email);
    }

    /**
     * Lấy OTP để kiểm tra
     */
    public String getOtp(String userId) {
        return otpRepository.findById(userId)
                .map(OTP::getOtpCode)
                .orElse(null); // Trả về null nếu không tìm thấy hoặc đã hết hạn
    }

    public void deleteOtp(String userId) {
        otpRepository.deleteById(userId);
    }
}
