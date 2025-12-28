package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewUserDataPoint {
    private int month;
    private Long bidder;
    private Long seller;
}
