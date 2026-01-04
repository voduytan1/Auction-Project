package com.example.backend.service;


import com.example.backend.dto.admin.dashboard.NewUserDataPoint;
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
import com.example.backend.utils.DateUtils;
import com.example.backend.utils.PageUtils;
import com.example.backend.utils.UserValidationUtils;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
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


import java.time.LocalDate;
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
    private final RedisService redisService;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, UserMapper userMapper,
                       AuthUtils authUtils, CacheManager cacheManager, JsonMapper jsonMapper, UserValidationUtils userValidationUtils, RedisService redisService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authUtils = authUtils;
        this.jsonMapper = jsonMapper;
        this.cacheManager = cacheManager;
        this.userValidationUtils = userValidationUtils;
        this.redisService = redisService;
        this.passwordEncoder = passwordEncoder;
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
        if(dto.getNewPassword() != null && dto.getOldPassword() != null && !passwordEncoder.matches(dto.getOldPassword(), entity.getPassword())) {
            throw new IllegalArgumentException("Password cũ không đúng");
        }
        if(dto.getNewPassword() != null && dto.getOldPassword() == null ) {
            throw new IllegalArgumentException("Vui lòng nhập password cũ");
        }
        if(dto.getNewPassword() == null && dto.getOldPassword() != null ) {
            throw new IllegalArgumentException("Vui lòng nhập password mới");
        }
        setPasswordIfProvided(entity, dto.getNewPassword());

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
        String savedOtp = redisService.getOtp(dto.getEmail());

        if (savedOtp == null || !savedOtp.equals(dto.getOTP())) {
            throw new RuntimeException("OTP sai hoặc đã hết hạn!");
        }

        redisService.deleteOtp(dto.getEmail());

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

    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy user với email "+ email));
    }

    public List<NewUserDataPoint> getNewUserChart() {
        List<NewUserDataPoint> data = new ArrayList<>();

        int year = LocalDate.now().getYear();

        for(int i = 1; i <= 12; i++) {
            LocalDateTime start = DateUtils.getStartOfSpecificMonth(i, year);
            LocalDateTime end = DateUtils.getEndOfSpecificMonth(i, year);
            Long bidder = userRepository.countByVaitroAndCreatedAtBetween(Role.BIDDER, start, end);
            Long seller = userRepository.countByVaitroAndCreatedAtBetween(Role.SELLER, start, end);

            data.add(new NewUserDataPoint(i, bidder, seller));
        }
        return data;
    }

    public Long countAll(){
        return userRepository.count();
    }

    public Long countByMonth(int month, int year){
        LocalDateTime start = DateUtils.getStartOfSpecificMonth(month, year);
        LocalDateTime end = DateUtils.getEndOfSpecificMonth(month, year);
        return userRepository.countByCreatedAtBetween(start, end);
    }
    private void setPasswordIfProvided(User entity, String rawPassword) {
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            entity.setPassword(authUtils.encodePassword(rawPassword));
        }
    }

}
