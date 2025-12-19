package com.example.backend.service;

import com.example.backend.dto.auth.TokenPair;
import com.example.backend.entity.JWTToken;
import com.example.backend.mapper.JWTTokenMapper;
import com.example.backend.repository.RedisRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public void deleteToken(String jti) {
        redisRepository.deleteById(jti);
    }

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
}
