package com.example.backend.dto.transaction;

import com.example.backend.entity.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    Long transactionId;

    Long productId;
    String tenSanPham;

    String buyerId;
    String tenNguoiMua;

    String sellerId;
    String tenNguoiBan;

    BigDecimal gia;

    TransactionStatus trangThai;

    String diaChiGiaoHang;

    String maVanDon;

    String phuongThucThanhToan;

    LocalDateTime thoiGianThanhToan;

    LocalDateTime thoiGianGiaoHang;

    LocalDateTime thoiGianNhanHang;
}
