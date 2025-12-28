package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueDataPoint {
    private int month;
    private BigDecimal revenue;          // Doanh thu
}
