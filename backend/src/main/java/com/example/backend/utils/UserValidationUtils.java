package com.example.backend.utils;

import com.example.backend.dto.common.ValidationResult;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class UserValidationUtils {

    private final UserRepository userRepository;
    private final AuthUtils authUtils;

    public UserValidationUtils(UserRepository userRepository, AuthUtils authUtils) {
        this.userRepository = userRepository;
        this.authUtils = authUtils;
    }

    /**
     * Validates user uniqueness and returns validation result without throwing exception
     * Useful for batch operations where you want to collect errors instead of failing fast
     * @param username the username to validate
     * @param email the email to validate
     * @return ValidationResult containing validation status and error message if any
     */
    public ValidationResult validateUserUniquenessWithResult(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            return ValidationResult.error("Username " + username + " đã tồn tại");
        }
        if (userRepository.existsByEmail(email)) {
            return ValidationResult.error("Email " + email + " đã tồn tại");
        }
        return ValidationResult.success();
    }

    /**
     * Finds existing user by username or email for upsert operations
     * Returns the existing user if found, otherwise returns empty Optional
     * @param username the username to check
     * @param email the email to check
     * @return Optional containing existing User if found, empty otherwise
     */
    public Optional<User> findExistingUserForUpsert(String username, String email) {
        // First check by username
        User existingUser = userRepository.findUserByUsername(username).orElse(null);
        if (existingUser != null) {
            return Optional.of(existingUser);
        }

        // Then check by email
        User userByEmail = userRepository.findUserByEmail(email).orElse(null);
        if (userByEmail != null) {
            return Optional.of(userByEmail);
        }

        return Optional.empty();
    }


    /**
     * Validates required fields for user creation
     * @param username the username to validate
     * @param email the email to validate
     * @return error message if validation fails, null if validation passes
     */
    public String validateRequiredFields(String username, String email) {
        if (username == null || username.trim().isEmpty()) {
            return "Username không được để trống";
        }
        if (email == null || email.trim().isEmpty()) {
            return "Email không được để trống";
        }
        return null;
    }

    /**
     * Prepares user entity for creation with proper defaults and encoding
     * @param user the user entity to prepare
     * @param password the raw password to encode
     */
    public void prepareUserForCreation(User user, String password) {
        if (user.getVaitro() == null) {
            user.setVaitro(Role.BIDDER);
        }

        if (password != null && !password.trim().isEmpty()) {
            user.setPassword(authUtils.encodePassword(password));
        }

        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
    }
}
