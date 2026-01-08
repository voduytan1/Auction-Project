package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", indexes = {
        @Index(name = "idx_chat_transaction", columnList = "transactionid"),
        @Index(name = "idx_chat_sender", columnList = "senderid"),
        @Index(name = "idx_chat_created", columnList = "created_at")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "messageid")
    Long messageid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transactionid", nullable = false)
    Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderid", nullable = false)
    User sender;

    @Column(name = "message_content", columnDefinition = "TEXT", nullable = false)
    String messageContent;

    @Column(name = "is_read", nullable = false)
    Boolean isRead = false;

    @Column(name = "message_type", length = 20)
    @Enumerated(EnumType.STRING)
    MessageType messageType = MessageType.TEXT;

    @Column(name = "attachment_url", length = 500)
    String attachmentUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
