package com.example.backend.dto.transaction.chat;

import com.example.backend.entity.MessageType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long messageid;
    private Long transactionid;
    private UUID senderid;
    private String senderName;
    private String senderAvatar;
    private String messageContent;
    private MessageType messageType;
    private String attachmentUrl;
    private Boolean isRead;
    private Boolean isSentByMe; // True nếu là tin nhắn của current user
    private LocalDateTime createdAt;
}
