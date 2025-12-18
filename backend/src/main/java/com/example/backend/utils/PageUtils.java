package com.example.backend.utils;

import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import org.springframework.data.domain.*;

import java.util.List;

public class PageUtils {
    public static PaginationInfo fromPage(Page<?> page, String search) {
        return PaginationInfo.builder()
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber() + 1) // Convert to 1-based
                .pageSize(page.getSize())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .sortBy(extractSortBy(page.getSort()))
                .sortOrder(extractSortOrder(page.getSort()))
                .search(search)
                .build();
    }

    public static String extractSortOrder(Sort sort) {
        if (sort == null || sort.isEmpty()) {
            return null;
        }

        // Get direction of first sort order
        return sort.stream()
                .findFirst()
                .map(order -> order.getDirection().name().toLowerCase())
                .orElse(null);
    }

    public static String extractSortBy(Sort sort) {
        if (sort == null || sort.isEmpty()) {
            return null;
        }

        // Get first sort order (primary sort field)
        return sort.stream()
                .findFirst()
                .map(Sort.Order::getProperty)
                .orElse(null);
    }

    public static Pageable createPageable(PaginationRequest request) {

        // Create Sort direction
        Sort.Direction direction = "asc".equalsIgnoreCase(request.getSortOrder())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        // Create Sort object
        Sort sort = Sort.by(direction, request.getSortBy());

        // Create Pageable (0-based indexing)
        return (Pageable) PageRequest.of(
                request.getPageZeroBased(),  // Convert 1-based to 0-based
                request.getSize(),           // Page size (đã validated trong DTO)
                sort                         // Sort criteria
        );
    }
    public static <T> Page<T> createPageFromSlice(
            List<T> currentPageContent,
            int pageNumber,
            int pageSize,
            long totalElements) {
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize);
        return new PageImpl<>(currentPageContent, pageable, totalElements);
    }
}
