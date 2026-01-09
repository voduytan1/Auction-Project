package com.example.backend.specification;

import com.example.backend.dto.product.filtercriteria.ProductFilterRequest;
import com.example.backend.entity.*;
import com.example.backend.utils.MyStringUtils;
import jakarta.persistence.criteria.Predicate;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ProductSpecification {

    public static Specification<@NotNull Product> getFilter(ProductFilterRequest criteria) {
        return Specification.where(hasKeyword(criteria.getKeyword()))
                .and(hasCategory(criteria.getCategoryId()))
                .and(hasPriceGreaterThanOrEqualTo(criteria.getMinPrice()))
                .and(hasPriceLessThanOrEqualTo(criteria.getMaxPrice()))
                .and(hasStatus(criteria.getStatus()))
                .and(hasSeller(criteria.getSellerId()))
                .and(notHasId(criteria.getExcludeId()));
    }

    private static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) { return null; }

            String normalized = MyStringUtils.removeAccents(keyword); // "dien di"
            String[] words = normalized.split("\\s+"); // ["dien", "di"]

            List<Predicate> predicates = new ArrayList<>();
            for (String word : words) {
                predicates.add(cb.like(root.get("searchText"), "%" + word + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<@NotNull Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return null;
            }
            return cb.equal(root.get(Product_.category).get(Category_.CATEGORYID), categoryId);
        };
    }

    // 3. Giá Min - Sử dụng Product_.giaHienTai
    private static Specification<@NotNull Product> hasPriceGreaterThanOrEqualTo(BigDecimal minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) {
                return null;
            }
            // CŨ: root.get("giaHienTai")
            return cb.greaterThanOrEqualTo(root.get(Product_.giaHienTai), minPrice);
        };
    }

    private static Specification<@NotNull Product> hasPriceLessThanOrEqualTo(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get(Product_.giaHienTai), maxPrice);
        };
    }

    private static Specification<@NotNull Product> hasStatus(ProductStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return null;
            }
            return cb.equal(root.get(Product_.trangThai), status);
        };
    }

    // 6. Seller - Sử dụng Product_.seller và User_.userid
    private static Specification<@NotNull Product> hasSeller(UUID sellerId) {
        return (root, query, cb) -> {
            if (sellerId == null) {
                return null;
            }
            return cb.equal(root.get(Product_.seller).get(User_.userid), sellerId);
        };
    }

    private static Specification<@NotNull Product> notHasId(Long excludeId) {
        return (root, query, cb) -> {
            if (excludeId == null) {
                return null;
            }
            return cb.notEqual(root.get(Product_.productid), excludeId);
        };
    }
}
