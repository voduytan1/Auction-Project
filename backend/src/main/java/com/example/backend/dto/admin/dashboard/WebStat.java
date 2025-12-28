package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebStat {
    Long usersCount;
    Integer userGrowth;

    Long auctionsCount;
    Long newAuctionsCount;

    Long bidsCount;
    Long newBidsCount;

    BigDecimal revenue;
    Integer revenueGrowth;
}
