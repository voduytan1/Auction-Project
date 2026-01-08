package com.example.backend.dto.transaction.chat;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatConversationResponse {
    private Long transactionid;
    private String productName;
    private String productImage;

    // Thông tin người còn lại trong conversation
    private UUID otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private Boolean otherUserOnline;

    // Tin nhắn cuối cùng
    private String lastMessage;
    private LocalDateTime lastMessageTime;

    // Số tin nhắn chưa đọc
    private Long unreadCount;

    // Tất cả tin nhắn (nếu fetch full conversation)
    private List<ChatMessageResponse> messages;
}
