package com.example.backend.service;

import com.example.backend.dto.auth.*;
import com.example.backend.entity.AuthProvider;
import com.example.backend.entity.JWTToken;
import com.example.backend.entity.User;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.exception.JwtAuthenticationException;
import com.example.backend.mapper.JWTTokenMapper;
import com.example.backend.repository.RedisRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.AuthUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
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
    private final UserRepository userRepository;


    @Value("${jwt.refreshToken.expirationTime}")
    private int refreshTokenExpirationTime;

    @Value("${google.client-id}")
    private String googleClientId;



    public LoginResponseWithRefreshToken login(LoginRequest loginRequest) {
        User user = userService.fineOne(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("Username không tồn tại"));
        if(user.getProvider().equals(AuthProvider.GOOGLE)){
            throw new ForbiddenException("Tài khoản này phải đăng nhập thông qua google login");
        }
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
                    .thoiHanBanHang(user.getThoiHanBanHang())
                    .diaChi(user.getDiaChi())
                    .hoVaTen(user.getHoVaTen())
                    .ngaySinh(user.getNgaySinh())
                    .soDienThoai(user.getSoDienThoai())
                    .anhDaiDien(user.getAnhDaiDien())
                    .diemDanhGia(user.getDiemDanhGia())
                    .soLuongDanhGia(user.getSoLuongDanhGia())
                    .email(user.getEmail())
                    .build();
        }else{
            throw new BadCredentialsException("Mật khẩu không đúng!");
        }
    }

    public FullRefreshTokenResponse refreshToken(String refreshToken) {
        TokenInfo tokenInfo = authUtils.validateAndExtractTokenInfo(refreshToken);
        String jti = tokenInfo.getJti();
        String userId = tokenInfo.getUserId();

        JWTToken jwtToken = redisRepository.findById(jti)
                .orElseThrow(() -> new EntityNotFoundException("Refresh Token không tồn tại hoặc đã bị thu hồi"));

        if (!jwtToken.getUserId().equals(userId)) {
            // Có thể là dấu hiệu tấn công token reuse -> Cân nhắc xóa luôn token trong Redis để chặn
            redisRepository.deleteById(jti);
            throw new JwtAuthenticationException("Token không chính chủ");
        }

        User user = userService.getUserById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user " + userId));

        //Xác thực id người dùng trùng với id đã lưu
        if(!jwtToken.getUserId().equals(userId)){
            throw new JwtAuthenticationException("Người dùng với Id " + userId + "không trùng khớp với Id được lưu");
        }

        //Xóa refresh Token cũ
        redisRepository.deleteById(jti);

        //Tạo và lưu refresh token mới
        TokenPair tokenPair = authUtils.generateTokenPair(user);

        redisService.createAndSaveJwtToken(tokenPair, userId, jwtTokenMapper, redisRepository);

        long expiresIn = ChronoUnit.SECONDS.between(Instant.now(), tokenPair.getAccessTokenExpirationTime());

        FullRefreshTokenResponse response = FullRefreshTokenResponse.builder()
                .accessToken(tokenPair.getAccessToken())
                .refreshToken(tokenPair.getRefreshToken())
                .expiresIn(expiresIn)
                .userid(String.valueOf(user.getUserid()))
                .username(user.getUsername())
                .email(user.getEmail())
                .vaitro(user.getVaitro())
                .thoiHanBanHang(user.getThoiHanBanHang())
                .hoVaTen(user.getHoVaTen())
                .diaChi(user.getDiaChi())
                .soDienThoai(user.getSoDienThoai())
                .ngaySinh(user.getNgaySinh())
                .diemDanhGia(user.getDiemDanhGia())
                .soLuongDanhGia(user.getSoLuongDanhGia())
                .anhDaiDien(user.getAnhDaiDien())
                .build();

        return response;
    }

    public void logout(String refreshToken) {
        String jti = authUtils.validateAndCheckRefreshToken(refreshToken);
        redisRepository.deleteById(jti);
    }

    public LoginResponseWithRefreshToken forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        String savedOtp = redisService.getOtp(forgotPasswordRequest.getEmail());

        if (savedOtp == null || !savedOtp.equals(forgotPasswordRequest.getOTP())) {
            throw new RuntimeException("OTP sai hoặc đã hết hạn!");
        }

        redisService.deleteOtp(forgotPasswordRequest.getEmail());

        User user =  userService.getUserByEmail(forgotPasswordRequest.getEmail());

        user.setPassword(authUtils.encodePassword(forgotPasswordRequest.getPassword()));

        User saved = userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest(saved.getUsername(), forgotPasswordRequest.getPassword(), forgotPasswordRequest.getRecaptchaToken());

        return login(loginRequest);

    }

    public LoginResponseWithRefreshToken loginWithGoogle(String idTokenString) {
        try {
            // 1. Cấu hình bộ verify của Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Xác thực token gửi lên
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new RuntimeException("Token Google không hợp lệ!");
            }

            // 3. Lấy thông tin user từ Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // 4. Kiểm tra xem user đã tồn tại trong DB chưa
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setHoVaTen(name);
                user.setUsername(email);
                user.setPassword("");
                user.setAnhDaiDien(pictureUrl);
                user.setProvider(AuthProvider.GOOGLE); // Nên thêm field này để phân biệt

                user = userRepository.save(user);
            }else{
                if (user.getProvider() == null) {
                    user.setProvider(AuthProvider.GOOGLE);
                    userRepository.save(user);
                }
            }

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
                    .thoiHanBanHang(user.getThoiHanBanHang())
                    .diaChi(user.getDiaChi())
                    .hoVaTen(user.getHoVaTen())
                    .ngaySinh(user.getNgaySinh())
                    .soDienThoai(user.getSoDienThoai())
                    .anhDaiDien(user.getAnhDaiDien())
                    .diemDanhGia(user.getDiemDanhGia())
                    .soLuongDanhGia(user.getSoLuongDanhGia())
                    .email(user.getEmail())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
    }
}
