package com.example.backend.controller;

import com.example.backend.dto.category.CategoryResponse;
import com.example.backend.dto.category.CategoryWithProductResponse;
import com.example.backend.dto.category.CreateCategoryRequest;
import com.example.backend.dto.category.UpdateCategoryRequest;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.dto.product.filtercriteria.ProductFilterRequest;
import com.example.backend.dto.user.CreateUserRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.entity.Category;
import com.example.backend.service.CategoryService;
import com.example.backend.service.ProductService;
import com.example.backend.utils.PageUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final ProductService productService;

    public CategoryController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<?>> getAllCategories(@ModelAttribute PaginationRequest request, @RequestParam(required = false) Integer level) {
        Pageable pageable = request.getPageable();
        if(level == null){
            throw new IllegalArgumentException("Vui lòng truyền tham số level");
        }
        Page<@NotNull CategoryResponse> result = categoryService.getPageCategoriesLevel(level,pageable);
        PaginationInfo paginationInfo = PageUtils.fromPage(result, null);
        return ResponseEntity.ok(ApiResponse.successWithPagination("Lấy danh sách danh mục thành công", result.getContent(), paginationInfo));
    }


    @GetMapping("/{id}/products")
    public ResponseEntity<@NotNull ApiResponse<CategoryWithProductResponse>> getProductByCategoryById(@PathVariable Long id, @ModelAttribute @Valid PaginationRequest paginationRequest) {
        CategoryResponse categoryResponse = categoryService.getById(id);

        ProductFilterRequest productFilterRequest = ProductFilterRequest.builder()
                .categoryId(id)
                .keyword(paginationRequest.getSearch())
                .build();

        Pageable pageable = paginationRequest.getPageable();

        Page<@NotNull ProductResponse> productResponse = productService.getAllProducts(productFilterRequest, pageable);

        PaginationInfo paginationInfo = PageUtils.fromPage(productResponse, paginationRequest.getTrimmedSearch());

        CategoryWithProductResponse result = CategoryWithProductResponse.builder()
                .categoryid(categoryResponse.getCategoryid())
                .tenDanhMuc(categoryResponse.getTenDanhMuc())
                .parentCategoryId(categoryResponse.getParentCategoryId())
                .parentCategoryName(categoryResponse.getParentCategoryName())
                .level(categoryResponse.getLevel())
                .moTa(categoryResponse.getMoTa())
                .products(productResponse.getContent())
                .build();

        String message = "Lấy danh sách sản phẩm thành công";
        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                result,
                paginationInfo
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse result = categoryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }


    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<CategoryResponse>> createCategory(@RequestBody @Valid CreateCategoryRequest request) {
        CategoryResponse result = categoryService.createOne(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo danh mục thành công",  result));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, @RequestBody @Valid UpdateCategoryRequest request) {
        CategoryResponse result = categoryService.update(id, request)
                .orElseThrow(()-> new EntityNotFoundException("Không tìm thấy danh mục với id " + id));
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NotNull Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteOne(id);
        return ResponseEntity.noContent().build();
    }
}
