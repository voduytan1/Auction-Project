package com.example.backend.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidHistoryResponse {
    private Long bidHistoryid;
    private String tenBidder;
    private UUID bidderId;
    private BigDecimal giaDat;
    private LocalDateTime thoiGianDat;
}
