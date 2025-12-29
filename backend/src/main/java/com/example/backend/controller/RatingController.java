package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.rating.CreateRatingRequest;
import com.example.backend.dto.rating.RatingResponse;
import com.example.backend.service.RatingService;
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
@RequestMapping("/rating")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping()
    public ResponseEntity<@NotNull ApiResponse<RatingResponse>> saveRating(@RequestBody @Valid CreateRatingRequest createRatingRequest, @AuthenticationPrincipal Jwt jwt){
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(UUID.fromString(sub).equals(createRatingRequest.getRateeId())){
            throw new IllegalArgumentException("Bạn không thể đánh giá chính mình");
        }
        RatingResponse result = ratingService.createOne(createRatingRequest, UUID.fromString(sub));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/mine")
    public ResponseEntity<@NotNull ApiResponse<List<RatingResponse>>> getRating(@AuthenticationPrincipal Jwt jwt, @ModelAttribute @Valid PaginationRequest paginationRequest){
        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Pageable pageable =  paginationRequest.getPageable();

        Page<@NotNull RatingResponse> result = ratingService.getAllByRaterId(UUID.fromString(sub), pageable);

        PaginationInfo paginationInfo = PageUtils.fromPage(result, paginationRequest.getTrimmedSearch());

        String message = "Lấy danh sách sản phẩm thành công";

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                result.getContent(),
                paginationInfo
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NotNull ApiResponse<List<RatingResponse>>> getRating(@PathVariable UUID id, @ModelAttribute @Valid PaginationRequest paginationRequest){
        Pageable pageable =  paginationRequest.getPageable();

        Page<@NotNull RatingResponse> result = ratingService.getAllByRateeId(id, pageable);

        PaginationInfo paginationInfo = PageUtils.fromPage(result, paginationRequest.getTrimmedSearch());

        String message = "Lấy danh sách sản phẩm thành công";

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                result.getContent(),
                paginationInfo
        ));
    }
}
