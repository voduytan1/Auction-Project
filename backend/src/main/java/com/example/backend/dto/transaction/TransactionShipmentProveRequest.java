package com.example.backend.dto.transaction;

import jakarta.validation.constraints.*;
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

    @NotBlank(message = "ảnh vận đơn không được rỗng")
    @Size(max = 255, message = "link ảnh vận đơn không được vượt quá 255 ký tự")
    private String anhVanDon;
}
