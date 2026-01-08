package com.example.backend.dto.websocket;

import com.example.backend.entity.MessageType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSocketChatMessage {
    private String type; // "MESSAGE", "TYPING", "READ", "ONLINE", "OFFLINE"
    private Long transactionid;
    private Long messageid;
    private UUID senderid;
    private String senderName;
    private String messageContent;
    private MessageType messageType;
    private String attachmentUrl;
    private LocalDateTime timestamp;
}
