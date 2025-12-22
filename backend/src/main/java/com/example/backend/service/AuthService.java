package com.example.backend.service;

import com.example.backend.dto.auth.FullRefreshTokenResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.LoginResponseWithRefreshToken;
import com.example.backend.dto.auth.TokenPair;
import com.example.backend.entity.JWTToken;
import com.example.backend.entity.User;
import com.example.backend.exception.JwtAuthenticationException;
import com.example.backend.mapper.JWTTokenMapper;
import com.example.backend.repository.RedisRepository;
import com.example.backend.utils.AuthUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserService userService;

    private final RedisService redisService;

    private final RedisRepository redisRepository;

    private final JWTTokenMapper jwtTokenMapper;

    private final AuthUtils authUtils;

    private final PasswordEncoder passwordEncoder;


    @Value("${jwt.refreshToken.expirationTime}")
    private int refreshTokenExpirationTime;



    public LoginResponseWithRefreshToken login(LoginRequest loginRequest) {
        User user = userService.fineOne(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("Username không tồn tại"));

        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String userId = user.getUserid().toString();

            JWTToken deleteToken = redisService.findByUserId(userId).orElse(null);
            //Xóa refreshToken cũ nếu đã tồn tại
            if(deleteToken != null){
                redisRepository.deleteById(deleteToken.getJti());
            }
            // Sinh ra cặp token mới
            TokenPair tokenPair = authUtils.generateTokenPair(user);

            redisService.createAndSaveJwtToken(tokenPair, userId, jwtTokenMapper, redisRepository);

            return LoginResponseWithRefreshToken.builder()
                    .accessToken(tokenPair.getAccessToken())
                    .refreshToken(tokenPair.getRefreshToken())
                    .userid(String.valueOf(user.getUserid()))
                    .username(user.getUsername())
                    .vaitro(user.getVaitro())
                    .diaChi(user.getDiaChi())
                    .hoVaTen(user.getHoVaTen())
                    .ngaySinh(user.getNgaySinh())
                    .soDienThoai(user.getSoDienThoai())
                    .anhDaiDien(user.getAnhDaiDien())
                    .email(user.getEmail())
                    .build();
        }else{
            throw new BadCredentialsException("Mật khẩu không đúng!");
        }
    }

    public FullRefreshTokenResponse refreshToken(String refreshToken, String userId) {
        //Kiểm tra người dùng còn tồn tại
        User user = userService.getUserById(UUID.fromString(userId)).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user " + userId));

        String jti = authUtils.validateAndCheckRefreshToken(refreshToken);

        JWTToken jwtToken = redisRepository.findById(jti).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy Refresh Token"));

        //Xác thực id người dùng trùng với id đã lưu
        if(!jwtToken.getUserId().equals(userId)){
            throw new JwtAuthenticationException("Người dùng với Id " + userId + "không trùng khớp với Id được lưu");
        }

        //Xóa refresh Token cũ
        redisRepository.deleteById(jti);

        //Tạo và lưu refresh token mới
        TokenPair tokenPair = authUtils.generateTokenPair(user);

        redisService.createAndSaveJwtToken(tokenPair, userId, jwtTokenMapper, redisRepository);

        return new FullRefreshTokenResponse(tokenPair.getAccessToken(), tokenPair.getRefreshToken(), ChronoUnit.SECONDS.between(Instant.now(),tokenPair.getAccessTokenExpirationTime()));
    }

    public void logout(String refreshToken) {
        String jti = authUtils.validateAndCheckRefreshToken(refreshToken);
        redisRepository.deleteById(jti);
    }
}
