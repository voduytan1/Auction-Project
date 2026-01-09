package com.example.backend.controller;

import com.example.backend.dto.auth.FullRefreshTokenResponse;
import com.example.backend.dto.auth.RefreshTokenResponse;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.user.CreateUserRequest;
import com.example.backend.dto.user.ResetPasswordRequest;
import com.example.backend.dto.user.UpdateUserRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.mapper.AuthMapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.AuthService;
import com.example.backend.service.RecaptchaService;
import com.example.backend.service.UpgradeRequestService;
import com.example.backend.service.UserService;
import com.example.backend.utils.CookieUtils;
import com.example.backend.utils.PageUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final UpgradeRequestService upgradeRequestService;
    private final RecaptchaService recaptchaService;
    private final AuthService authService;
    private final CookieUtils cookieUtils;
    private final AuthMapper authMapper;

    @Value("${DEFAULT_PASSWORD}")
    private String defaultPassword;

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<UserResponse>>> getAllUser(@Valid @ModelAttribute PaginationRequest request) {

        Page<@NotNull UserResponse> usersPage = userService.findMany(request);

        PaginationInfo paginationInfo = PageUtils.fromPage(usersPage, request.getTrimmedSearch());

        String message = request.hasSearch()
                ? String.format("Tìm kiếm user với từ khóa '%s' thành công", request.getTrimmedSearch())
                : "Lấy danh sách user thành công";

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                usersPage.getContent(),
                paginationInfo
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<@NotNull ApiResponse<UserResponse>> getSelf(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponse user = userMapper.toResponse(userService.getUserById(UUID.fromString(sub)).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy profile user")));
        return ResponseEntity.ok(ApiResponse.success("Đã tìm thấy profile của user", user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        UserResponse user = userMapper.toResponse(userService.getUserById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user " + id)));
        return ResponseEntity.ok(ApiResponse.success("Đã tìm thấy user với id "+ id, user));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<UserResponse>> createUser(@RequestBody @Valid CreateUserRequest request) {
        boolean isCaptchaValid = recaptchaService.validateToken(request.getRecaptchaToken());

        if (!isCaptchaValid) {
            throw new IllegalArgumentException("Captcha không hợp lệ hoặc đã hết hạn!");
        }
        UserResponse user = userService.createOne(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo user thành công",  user));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<@NotNull ApiResponse<UserResponse>> resetPassword(@PathVariable UUID id, @RequestBody @Valid ResetPasswordRequest request) {
        UserResponse response = userService.resetPassword(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/request-seller")
    public ResponseEntity<@NotNull Void> requestSeller(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }
        upgradeRequestService.CreateRequest(UUID.fromString(sub));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<RefreshTokenResponse>> updateUser(@PathVariable UUID id, @RequestBody @Valid UpdateUserRequest dto, @CookieValue("refresh_token") String refreshToken, HttpServletResponse response) {
        UserResponse useResponse = userService.update(id, dto)
                .orElseThrow(()-> new EntityNotFoundException("Không tìm thấy user " + id));

        FullRefreshTokenResponse result = authService.refreshToken(refreshToken);
        cookieUtils.setRefreshTokenCookie(response, result.getRefreshToken());

        return ResponseEntity.ok(ApiResponse.success(authMapper.toRefreshTokenResponse(result)));


    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NotNull Void> deleteOneUser(@PathVariable UUID id) {
        return userService.deleteOne(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
