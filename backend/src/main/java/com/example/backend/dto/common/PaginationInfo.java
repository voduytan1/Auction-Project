package com.example.backend.dto.common;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaginationInfo {
    long totalElements;
    int totalPages;
    int currentPage;
    int pageSize;
    boolean hasNext;
    boolean hasPrevious;
    String sortBy;
    String sortOrder;
    String search;

}
