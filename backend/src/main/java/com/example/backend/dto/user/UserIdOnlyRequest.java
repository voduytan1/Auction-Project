package com.example.backend.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class UserIdOnlyRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;
}
