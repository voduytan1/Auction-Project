package com.example.backend.dto.transaction.chat;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnreadCountResponse {
    private Long transactionid;
    private Long unreadCount;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}
