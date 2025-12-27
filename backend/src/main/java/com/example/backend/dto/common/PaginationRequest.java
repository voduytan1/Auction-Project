package com.example.backend.dto.common;

import com.example.backend.utils.PageUtils;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaginationRequest {

    @Min(value = 1, message = "Page phải lớn hơn 0")
    Integer page;

    @Min(value = 1, message = "Size phải lớn hơn 0")
    @Max(value = 100, message = "Size không được vượt quá 100")
    Integer size;


    String sortBy;

    @Pattern(regexp = "^(asc|desc)$", message = "Sort order phải là 'asc' hoặc 'desc'")
    String sortOrder = "desc";

    String search;

    // Helper methods
    public int getPageZeroBased() {
        if (page == null || page < 1) {
            return 0;
        }
        return page - 1;
    }

    public int getSizeOrDefault() {
        return (size == null || size < 1) ? 10 : size;
    }

    public Sort getSort() {
        String directionStr = (sortOrder != null) ? sortOrder : "desc";
        Sort.Direction direction = directionStr.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

        String property = (sortBy != null && !sortBy.isEmpty()) ? sortBy : "createdAt";

        return Sort.by(direction, property);
    }
    public boolean hasSearch() {
        return search != null && !search.trim().isEmpty();
    }

    public String getTrimmedSearch() {
        return hasSearch() ? search.trim() : null;
    }
    public Pageable getPageable() {
        if (page == null && size == null) {
            return Pageable.unpaged(getSort());

        }
        return  PageUtils.createPageable(this);
    }
}
