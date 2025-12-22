package com.example.backend.service;

import com.example.backend.dto.category.CategoryResponse;
import com.example.backend.dto.category.CreateCategoryRequest;
import com.example.backend.dto.category.UpdateCategoryRequest;
import com.example.backend.entity.Category;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.base.BaseService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService extends BaseService<Category,Long, CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse> {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    protected JpaRepository<@NotNull Category, @NotNull Long> getRepository() {
        return categoryRepository;
    }

    @Override
    protected void validateForCreation(CreateCategoryRequest dto) {
        if(categoryRepository.existsBytenDanhMuc(dto.getTenDanhMuc())){
            String message = String.format("Danh mục với tên `%s` đã tồn tại", dto.getTenDanhMuc());
            throw new EntityExistsException(message);
        }
    }

    @Override
    protected Category mapToEntity(CreateCategoryRequest dto) {
        return categoryMapper.toEntity(dto);
    }

    @Override
    protected CategoryResponse mapToResponse(Category entity) {
        return categoryMapper.toResponse(entity);
    }

    @Override
    protected void updateEntityFromDto(UpdateCategoryRequest dto, Category entity) {
        categoryMapper.updateEntityFromDto(dto,entity);
    }

    @Override
    protected void beforeSave(Category entity, CreateCategoryRequest dto) {
        if (dto.getParentCategoryId() == null) {
            entity.setLevel(1);
            entity.setParentCategory(null);
        } else {
            processParentCategory(entity, dto.getParentCategoryId());
        }
    }


    @Override
    protected void beforeUpdate(Category entity, UpdateCategoryRequest dto) {
        //Check and set parent category + set level
        if (dto.getParentCategoryId() != null) {
            // check logic: can't assign it into its parent
            if (entity.getCategoryid() != null && entity.getCategoryid().equals(dto.getParentCategoryId())) {
                throw new IllegalArgumentException("Một danh mục không thể làm cha của chính nó.");
            }
            processParentCategory(entity, dto.getParentCategoryId());
        }
    }

    @Override
    protected void beforeDelete(Long id) {
        Boolean check = categoryRepository.existsByParentCategoryCategoryid(id);
        if(check){
            throw new DataIntegrityViolationException("Không thể xóa danh mục này vì nó đang chứa các danh mục con. Vui lòng xóa danh mục con trước.");
        }
    }

    @Override
    protected void evictCaches() {

    }

    public List<CategoryResponse> getAllCategoriesLevel(int level) {
        return categoryRepository.findAllByLevel(level).stream()
                .map(categoryMapper::toResponse)
                .toList();
    }


    public Page<@NotNull CategoryResponse> getPageCategoriesLevel(int level, Pageable pageable) {
        Page<@NotNull Category> page= categoryRepository.findAllByLevel(level, pageable);

        List<CategoryResponse> categoryResponses = page.getContent().stream()
                .map(categoryMapper::toResponse)
                .toList();

        return new PageImpl<>(categoryResponses, pageable, page.getTotalElements());
    }

    public CategoryResponse getById(Long id) {
        Category result = findById(id).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy danh mục với id " + id));
        return  categoryMapper.toResponse(result);
    }

    private void processParentCategory(Category entity, Long parentCategoryId) {
        Category parent = categoryRepository.findById(parentCategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với id " + parentCategoryId));

        if (parent.getLevel() >= 2) {
            throw new IllegalArgumentException("Hệ thống chỉ hỗ trợ tối đa 2 cấp danh mục. Danh mục này không thể có danh mục con.");
        }

        entity.setParentCategory(parent);
        entity.setLevel(parent.getLevel() + 1);
    }

}
