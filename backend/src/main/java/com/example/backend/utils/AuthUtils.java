package com.example.backend.utils;

import com.example.backend.dto.auth.TokenDetails;
import com.example.backend.dto.auth.TokenInfo;
import com.example.backend.dto.auth.TokenPair;
import com.example.backend.entity.User;
import com.example.backend.exception.InvalidTokenException;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Component
@RequiredArgsConstructor
public class AuthUtils {
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    @Value("${jwt.accessToken.expirationTime}")
    private int accessTokenExpirationTime;

    @Value("${jwt.refreshToken.expirationTime}")
    private int refreshTokenExpirationTime;

    private final PasswordEncoder passwordEncoder;

    public TokenPair generateTokenPair(User user) {
        String jti = UUID.randomUUID().toString();

        TokenDetails accessToken = generateAccessToken(user, jti);
        TokenDetails refreshToken = generateRefreshToken(user, jti);

        return TokenPair.builder()
                .accessToken(accessToken.getToken())
                .refreshToken(refreshToken.getToken())
                .jti(jti)
                .accessTokenExpirationTime(accessToken.getExpiresAt())
                .refreshTokenExpirationTime(refreshToken.getExpiresAt())
                .build();
    }


    private TokenDetails generateAccessToken(User user, String jti) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

        Instant expirationTime = Instant.now().plus(accessTokenExpirationTime, ChronoUnit.MINUTES);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getUserid()))
                .issueTime(new Date())
                .expirationTime(Date.from(expirationTime))
                .jwtID(jti)
                .claim("username", user.getUsername())
                .claim("vaitro", user.getVaitro())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            String token =  jwsObject.serialize();

            return new TokenDetails(token, expirationTime);

        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private TokenDetails generateRefreshToken(User user, String jti) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

        Instant expirationTime = Instant.now().plus(refreshTokenExpirationTime, ChronoUnit.DAYS);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getUserid()))
                .issueTime(new Date())
                .expirationTime(Date.from(expirationTime))
                .jwtID(jti)
                .claim("type", "refresh")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            String token =  jwsObject.serialize();

            return new TokenDetails(token, expirationTime);
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }


    public String encodePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return null;
        }
        return passwordEncoder.encode(password);
    }

    public JWTClaimsSet validateAccessToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new InvalidTokenException("Access token rỗng");
        }
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            // 1. Kiểm tra chữ ký
            if (!signedJWT.verify(verifier)) {
                throw new InvalidTokenException("Chữ ký Access Token không hợp lệ!");
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            // 2. Kiểm tra thời gian hết hạn
            if (claimsSet.getExpirationTime().before(new Date())) {
                throw new InvalidTokenException("Access Token đã hết hạn!");
            }

            return claimsSet;
        } catch (ParseException | JOSEException e) {
            throw new InvalidTokenException("Lỗi định dạng Access Token: " + e.getMessage());
        }
    }

    public String validateAndCheckRefreshToken(String token){
        if (token == null || token.trim().isEmpty()) {
            throw new InvalidTokenException("Refresh token rỗng");
        }
        try{
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            SignedJWT signedJWT = SignedJWT.parse(token);

            boolean isSignatureValid = signedJWT.verify(verifier);
            if (!isSignatureValid) {
                throw new InvalidTokenException("Chữ ký token không hợp lệ!");
            }

            JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();
            if(jwtClaimsSet.getExpirationTime().before(new Date())){
                throw new InvalidTokenException("Token đã quá hạn!");
            }

            if(!Objects.equals(jwtClaimsSet.getStringClaim("type"), "refresh")){
                throw new InvalidTokenException("Token không phải refresh token!");
            }

            return jwtClaimsSet.getJWTID();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        } catch (ParseException e) {
            throw new InvalidTokenException("Token không đúng định dạng JWT! " + e.getMessage());
        }
    }



    public static List<String> getRoles (){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of(); // Trả về danh sách rỗng nếu không có ai đăng nhập
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

    }

    public static String getID() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // Kiểm tra xem đây có phải là authentication từ JWT không
        if (authentication instanceof JwtAuthenticationToken) {
            // Lấy đối tượng Jwt gốc
            Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();

            // Lấy thẳng claim "sub"
            return jwt.getSubject(); // hoặc jwt.getClaimAsString("sub")
        }

        // Nếu là loại
        //  authentication khác (ví dụ: basic auth, form login)
        // nó vẫn sẽ trả về "name" (thường là username)
        return authentication.getName();
    }

    public String getUserIdFromRefreshToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new InvalidTokenException("Refresh token rỗng");
        }
        try {
            // 1. Parse token
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            // 2. Kiểm tra chữ ký (Quan trọng để đảm bảo token không bị giả mạo)
            if (!signedJWT.verify(verifier)) {
                throw new InvalidTokenException("Chữ ký token không hợp lệ!");
            }

            // 3. Lấy Claims
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            // 4. Kiểm tra hạn
            if (claims.getExpirationTime().before(new Date())) {
                throw new InvalidTokenException("Token đã quá hạn!");
            }

            // 5. Kiểm tra loại token (phải là refresh)
            if (!Objects.equals(claims.getStringClaim("type"), "refresh")) {
                throw new InvalidTokenException("Token không phải refresh token!");
            }

            // 6. Trả về Subject (UserId)
            return claims.getSubject();

        } catch (ParseException | JOSEException e) {
            throw new InvalidTokenException("Lỗi đọc thông tin từ Refresh Token: " + e.getMessage());
        }
    }

    public TokenInfo validateAndExtractTokenInfo(String token) {
        // 1. Tận dụng hàm private getClaimsFromRefreshToken tôi đã gợi ý ở câu trả lời trước
        // Hoặc viết gộp logic parse & verify tại đây
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            if (!signedJWT.verify(verifier)) {
                throw new InvalidTokenException("Chữ ký token không hợp lệ!");
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            if (claims.getExpirationTime().before(new Date())) {
                throw new InvalidTokenException("Token đã quá hạn!");
            }

            if (!Objects.equals(claims.getStringClaim("type"), "refresh")) {
                throw new InvalidTokenException("Token không phải refresh token!");
            }

            // TRẢ VỀ CẢ 2 CÙNG LÚC
            return new TokenInfo(claims.getJWTID(), claims.getSubject());

        } catch (ParseException | JOSEException e) {
            throw new InvalidTokenException("Token lỗi: " + e.getMessage());
        }
    }
}
