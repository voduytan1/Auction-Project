package com.example.backend.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceAutoBidResponse {
    private Boolean success;
    private String message;
    private AutoBidResponse autoBid;
    private BigDecimal giaHienTaiSanPham;
    private String currentWinner; // Masked name
}
