package com.example.backend.dto.bid;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoBidResponse {
    private Long autobidid;
    private Long productid;
    private String tenSanPham;
    private Long bidderid;
    private String tenBidder;
    private BigDecimal giaToiDa;
    private BigDecimal giaHienTai;
    private Boolean isActive;
    private Boolean isWinning; // Đang giữ giá cao nhất?
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
