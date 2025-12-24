package com.example.backend.dto.rating;


import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {
    private Long ratingid;
    private UUID raterid;
    private String tenRater; // Người đánh giá
    private UUID rateeid;
    private String tenRatee; // Người được đánh giá
    private Long productid;
    private String tenSanPham;
    private Integer diem; // +1 hoặc -1
    private String nhanXet;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
