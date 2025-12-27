package com.example.backend.dto.transaction;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionIdRequest {
    @NotNull(message = "Mã giao dịch không được để trống")
    Long transactionId;
}
