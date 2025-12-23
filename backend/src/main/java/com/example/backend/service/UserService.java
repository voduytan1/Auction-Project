package com.example.backend.service;


import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.user.CreateUserRequest;
import com.example.backend.dto.user.UpdateUserRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.base.BaseService;
import com.example.backend.utils.AuthUtils;
import com.example.backend.utils.PageUtils;
import com.example.backend.utils.UserValidationUtils;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.access.AccessDeniedException;
import tools.jackson.databind.json.JsonMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class UserService extends BaseService<User, UUID, CreateUserRequest, UpdateUserRequest, UserResponse> {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthUtils authUtils;
    private final CacheManager cacheManager;
    private final JsonMapper jsonMapper;
    private final UserValidationUtils userValidationUtils;


    public UserService(UserRepository userRepository, UserMapper userMapper,
                       AuthUtils authUtils, CacheManager cacheManager, JsonMapper jsonMapper, UserValidationUtils userValidationUtils) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authUtils = authUtils;
        this.jsonMapper = jsonMapper;
        this.cacheManager = cacheManager;
        this.userValidationUtils = userValidationUtils;
    }

    // Implementation of abstract methods
    @Override
    protected JpaRepository<@NotNull User, @NotNull UUID> getRepository() {
        return userRepository;
    }

    @Override
    protected void validateForCreation(CreateUserRequest dto) {
        var validationResult = userValidationUtils.validateUserUniquenessWithResult(dto.getUsername(), dto.getEmail());
        if (!validationResult.isValid()) {
            throw new DataIntegrityViolationException(validationResult.getErrorMessage());
        }
    }

    @Override
    protected User mapToEntity(CreateUserRequest dto) {
        return userMapper.toEntity(dto);
    }

    @Override
    protected UserResponse mapToResponse(User entity) {
        return userMapper.toResponse(entity);
    }

    @Override
    protected void updateEntityFromDto(UpdateUserRequest dto, User entity) {
        userMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    protected void beforeSave(User entity, CreateUserRequest dto) {
        entity.setPassword(authUtils.encodePassword(dto.getPassword()));
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
    }

    @Override
    protected void beforeUpdate(User entity, UpdateUserRequest dto) {
        setPasswordIfProvided(entity, dto.getPassword());

        entity.setUpdatedAt(LocalDateTime.now());
    }


    @Override
    protected void beforeDelete(UUID id) {
        // No special logic needed for user deletion
    }

    @Override
    protected void evictCaches() {
        // Cache eviction will be handled by specific annotations on public methods
    }


    // Override template methods with proper cache annotations
    @Override
    @Transactional
    @CacheEvict(cacheNames = "user_list", allEntries = true)
    public UserResponse createOne(CreateUserRequest dto) {
        return super.createOne(dto);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "user", key = "#id"),
            @CacheEvict(cacheNames = "user_list", allEntries = true)
    })
    public boolean deleteOne(UUID id) {
        return super.deleteOne(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> fineOne(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Transactional(readOnly = true)
    public Page<@NotNull UserResponse> findMany(PaginationRequest request) {
        // Lấy từ DB
        Pageable pageable = PageUtils.createPageable(request);
        Page<@NotNull User> usersPage = request.hasSearch()
                ? userRepository.findUsersWithSearch(request.getTrimmedSearch(), pageable)
                : userRepository.findAll(pageable);

        List<UserResponse> userResponses = usersPage.getContent().stream()
                .map(userMapper::toResponse)
                .sorted(Comparator.comparing(UserResponse::getCreatedAt))
                .toList();

        return new PageImpl<>(userResponses, pageable, usersPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(UUID userId) {
        // Lấy từ DB

        return userRepository.findById(userId);
    }

    @Transactional
    public void approveSeller(UUID id) {
        User user = userRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy user với id "+ id));
        if(user.getVaitro()!= Role.BIDDER){
            throw new AccessDeniedException("User không phải BIDDER");
        }
        user.setVaitro(Role.SELLER);
        user.setThoiHanBanHang(LocalDateTime.now().plusDays(7));
        userRepository.save(user);
    }

    private void setPasswordIfProvided(User entity, String rawPassword) {
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            entity.setPassword(authUtils.encodePassword(rawPassword));
        }
    }

}
