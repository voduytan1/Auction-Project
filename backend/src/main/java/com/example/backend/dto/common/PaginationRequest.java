package com.example.backend.dto.common;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaginationRequest {

    @Min(value = 1, message = "Page phải lớn hơn 0")
    @Builder.Default
    Integer page = 1;

    @Min(value = 1, message = "Size phải lớn hơn 0")
    @Max(value = 100, message = "Size không được vượt quá 100")
    @Builder.Default
    Integer size = 10;

    @Builder.Default
    String sortBy = "createdAt";

    @Pattern(regexp = "^(asc|desc)$", message = "Sort order phải là 'asc' hoặc 'desc'")
    @Builder.Default
    String sortOrder = "desc";

    String search;

    // Helper methods
    public int getPageZeroBased() {
        return Math.max(0, page - 1); // Convert to 0-based
    }

    public boolean hasSearch() {
        return search != null && !search.trim().isEmpty();
    }

    public String getTrimmedSearch() {
        return hasSearch() ? search.trim() : null;
    }
}
