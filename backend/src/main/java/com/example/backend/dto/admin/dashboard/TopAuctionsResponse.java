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
public class TopAuctionsResponse {
    String tenSanPham;
    BigDecimal giaHienTai;
    Integer soLuotRaGia;
}
