package com.example.backend.dto.blockedbidder;


import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedBidderResponse {
    private Long blockid;
    private Long productid;
    private String tenSanPham;
    private UUID bidderid;
    private String tenBidder;
    private String emailBidder;
    private UUID sellerid;
    private String tenSeller;
    private String lyDo;
    private LocalDateTime createdAt;
}
