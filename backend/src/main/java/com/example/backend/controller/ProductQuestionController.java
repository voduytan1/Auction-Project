package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.product.ProductIdRequest;
import com.example.backend.dto.product.question.AnswerProductQuestionRequest;
import com.example.backend.dto.product.question.CreateProductQuestionRequest;
import com.example.backend.dto.product.question.ProductQuestionResponse;
import com.example.backend.service.ProductQuestionService;
import com.example.backend.utils.PageUtils;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/questions")
public class ProductQuestionController {
    private final ProductQuestionService  productQuestionService;

    public ProductQuestionController(ProductQuestionService productQuestionService) {
        this.productQuestionService = productQuestionService;
    }

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<ProductQuestionResponse>>> getAllByProduct(@Valid @ModelAttribute ProductIdRequest productIdRequest, @Valid @ModelAttribute PaginationRequest request){
        Long productid = productIdRequest.getProductId();
        if(request.getSortBy() == null){
            request.setSortBy("thoiGianHoi");
        }
        Pageable pageable = request.getPageable();

        Page<@NotNull ProductQuestionResponse> page = productQuestionService.findAllByProduct(productid, pageable);

        PaginationInfo paginationInfo = PageUtils.fromPage(page, request.getTrimmedSearch());

        String message = "Lấy danh sách user thành công";

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                page.getContent(),
                paginationInfo
        ));

    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<ProductQuestionResponse>> saveProductQuestion(@RequestBody CreateProductQuestionRequest createProductQuestionRequest, @AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }

        ProductQuestionResponse response = productQuestionService.createOne(createProductQuestionRequest, UUID.fromString(sub));

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<ProductQuestionResponse>> answerProductQuestion(@RequestBody AnswerProductQuestionRequest answerProductQuestionRequest, @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }

        ProductQuestionResponse response = productQuestionService.updateOne(answerProductQuestionRequest, UUID.fromString(sub), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
