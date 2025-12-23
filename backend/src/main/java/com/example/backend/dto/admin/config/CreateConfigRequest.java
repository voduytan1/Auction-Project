package com.example.backend.dto.admin.config;

import com.example.backend.entity.ConfigVariable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateConfigRequest {
    @NotNull
    ConfigVariable variable;
    @NotNull
    Integer value;
}
