package com.example.backend.controller;

import com.example.backend.dto.blockedbidder.BlockedBidderResponse;
import com.example.backend.dto.blockedbidder.CreateBlockedBidderRequest;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.dto.product.descriptionhistory.AppendDescriptionRequest;
import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.dto.product.filtercriteria.ProductFilterRequest;
import com.example.backend.service.BlockedBidderService;
import com.example.backend.service.ProductDescriptionHistoryService;
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
    private final ProductDescriptionHistoryService productDescriptionHistoryService;
    private final BlockedBidderService blockedBidderService;

    public ProductController(ProductService productService, ProductDescriptionHistoryService productDescriptionHistoryService, BlockedBidderService blockedBidderService) {
        this.productService = productService;
        this.productDescriptionHistoryService = productDescriptionHistoryService;
        this.blockedBidderService = blockedBidderService;
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

    @PostMapping("/cancel/{id}")
    public ResponseEntity<@NotNull ApiResponse<ProductResponse>> cancelProduct(@PathVariable Long id) {
//        String sub = jwt != null ? jwt.getSubject() : null;
//        if(sub == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Lỗi access token không hợp lệ"));
//        }
        ProductResponse result = productService.cancelProduct(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/block")
    public ResponseEntity<@NotNull ApiResponse<BlockedBidderResponse>> blockBidder(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid CreateBlockedBidderRequest request) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Lỗi access token không hợp lệ"));
        }
        BlockedBidderResponse result = blockedBidderService.createOne(request,UUID.fromString(sub));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping
    public ResponseEntity<@NotNull ApiResponse<DescriptionHistoryResponse>> appendDescription(@RequestBody @Valid AppendDescriptionRequest request, @AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Lỗi access token không hợp lệ"));
        }
        DescriptionHistoryResponse result = productDescriptionHistoryService.createOne(request, UUID.fromString(sub));

        return  ResponseEntity.ok(ApiResponse.success(result));
    }
}
