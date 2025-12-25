package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.service.TransactionService;
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
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/seller")
    public ResponseEntity<@NotNull ApiResponse<List<TransactionResponse>>> getOwnSellerTransactions(@Valid @ModelAttribute PaginationRequest request, @AuthenticationPrincipal Jwt jwt){
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Pageable pageable = request.getPageable();
        Page<@NotNull TransactionResponse> page = transactionService.findOwnSellerTransactions(pageable, UUID.fromString(sub));
        PaginationInfo paginationInfo = PageUtils.fromPage(page, request.getTrimmedSearch());

        return ResponseEntity.ok(ApiResponse.successWithPagination("Lấy danh sách transaction thành công",page.getContent(), paginationInfo));
    }

    @GetMapping("/buyer")
    public ResponseEntity<@NotNull ApiResponse<List<TransactionResponse>>> getOwnBuyerTransactions(@Valid @ModelAttribute PaginationRequest request, @AuthenticationPrincipal Jwt jwt){
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Pageable pageable = request.getPageable();
        Page<@NotNull TransactionResponse> page = transactionService.findOwnBuyerTransactions(pageable, UUID.fromString(sub));
        PaginationInfo paginationInfo = PageUtils.fromPage(page, request.getTrimmedSearch());

        return ResponseEntity.ok(ApiResponse.successWithPagination("Lấy danh sách transaction thành công",page.getContent(), paginationInfo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<TransactionResponse>> getTransaction(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt){
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TransactionResponse result = transactionService.findOne(id, UUID.fromString(sub));
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
