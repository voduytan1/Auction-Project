package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.dto.product.filtercriteria.ProductFilterRequest;
import com.example.backend.service.ProductService;
import com.example.backend.utils.PageUtils;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<ProductResponse>>> getAllProducts(@ModelAttribute @Valid ProductFilterRequest productFilterRequest, @ModelAttribute @Valid PaginationRequest paginationRequest) {
        String message = "Lấy danh sách sản phẩm thành công";
        Pageable pageable = paginationRequest.getPageable();
        productFilterRequest.setKeyword(paginationRequest.getSearch());

        Page<@NotNull ProductResponse> result = productService.getAllProducts(productFilterRequest, pageable);
        PaginationInfo paginationInfo = PageUtils.fromPage(result, paginationRequest.getTrimmedSearch());

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                result.getContent(),
                paginationInfo
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<ProductResponse>> getProductById(@PathVariable @NotNull Long id) {
        ProductResponse result =  productService.getProductById(id);
        return  ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<ProductResponse>> addProduct(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid CreateProductRequest request) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Lỗi access token không hợp lệ"));
        }
        ProductResponse result = productService.createProduct(UUID.fromString(sub), request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
