package com.example.backend.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class RecaptchaResponse {
    private boolean success;

    @JsonProperty("challenge_ts")
    private String challengeTs; // Thời gian verify

    private String hostname; // Hostname của site

    @JsonProperty("error-codes")
    private List<String> errorCodes; // Danh sách lỗi nếu có

    // Nếu dùng v3, thêm field này:
    // private double score;
    // private String action;
}
