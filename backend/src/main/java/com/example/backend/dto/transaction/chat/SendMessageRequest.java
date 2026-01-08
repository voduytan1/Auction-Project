package com.example.backend.dto.transaction.chat;

import com.example.backend.entity.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {
    @NotNull(message = "Transaction ID không được để trống")
    private Long transactionid;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String messageContent;

    private MessageType messageType = MessageType.TEXT;

    private String attachmentUrl;
}
