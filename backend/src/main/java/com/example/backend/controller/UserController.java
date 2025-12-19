package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.user.CreateUserRequest;
import com.example.backend.dto.user.UpdateUserRequest;
import com.example.backend.dto.user.UserIdOnlyRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.UserService;
import com.example.backend.utils.PageUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

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
        UserResponse user = userService.createOne(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo user thành công",  user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<UserResponse>> updateUser(@PathVariable UUID id, @RequestBody @Valid UpdateUserRequest dto) {
        return userService.update(id, dto)
                .map(updated -> ResponseEntity.ok(ApiResponse.success("Cập nhật user thành công", updated)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy user " + id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NotNull Void> deleteOneUser(@PathVariable UUID id) {
        return userService.deleteOne(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<@NotNull Void> deleteManyUser(@Valid @RequestBody @NotEmpty List<UserIdOnlyRequest> ids) {
        var userIds = ids.stream().map(UserIdOnlyRequest::getUserId).toList();
        userService.deleteMany(userIds);
        return ResponseEntity.noContent().build();
    }
}
