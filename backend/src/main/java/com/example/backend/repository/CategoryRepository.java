package com.example.backend.repository;

import com.example.backend.dto.category.CategoryResponse;
import com.example.backend.entity.Category;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<@NotNull Category, @NotNull Long> {
    List<Category> findAllByLevel(int level);
    Page<@NotNull Category> findAllByLevel(int level, Pageable pageable);
    Page<@NotNull Category> findAllByParentCategory_Categoryid(Long categoryid, Pageable pageable);

    Boolean existsBytenDanhMuc(@NotNull String tenDanhMuc);
    Boolean existsByParentCategoryCategoryid(@NotNull Long parentCategoryId);
}
