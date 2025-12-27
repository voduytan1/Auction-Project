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
public class TransactionShipmentProveRequest {
    @NotBlank(message = "mã vận đơn không được rỗng")
    private String maVanDon;
}
