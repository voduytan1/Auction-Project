package com.example.backend.dto.blockedbidder;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBlockedBidderRequest {
    @NotNull(message = "Product ID không được để trống")
    private Long productid;

    @NotNull(message = "Bidder ID không được để trống")
    private Long bidderid;

    private String lyDo; // Lý do block
}
