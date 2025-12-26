package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.rating.CreateRatingRequest;
import com.example.backend.dto.rating.RatingResponse;
import com.example.backend.service.RatingService;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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
}
