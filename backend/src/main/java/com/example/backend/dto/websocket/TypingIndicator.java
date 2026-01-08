package com.example.backend.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypingIndicator {
    private Long transactionid;
    private UUID userid;
    private String username;
    private Boolean isTyping;
}
