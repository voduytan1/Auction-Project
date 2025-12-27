package com.example.backend.dto.transaction;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionAddressRequest {
    @NotBlank(message = "Địa chỉ giao hàng không được rỗng")
    private String diaChiGiaoHang;
}
