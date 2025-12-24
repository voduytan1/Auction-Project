package com.example.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingStatsResponse {
    private UUID userid;
    private String hoVaTen;
    private Long totalRatings;
    private Long positiveRatings;
    private Long negativeRatings;
    private Double ratingPercentage;
    private Boolean canBid;
}
