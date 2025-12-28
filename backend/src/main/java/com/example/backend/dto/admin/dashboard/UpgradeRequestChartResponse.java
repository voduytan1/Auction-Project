package com.example.backend.dto.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpgradeRequestChartResponse {
    Long pending;
    Long approved;
    Long rejected;
    Long total;
}
