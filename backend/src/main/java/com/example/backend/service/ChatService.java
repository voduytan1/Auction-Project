package com.example.backend.service;

import com.example.backend.dto.transaction.chat.ChatConversationResponse;
import com.example.backend.dto.transaction.chat.ChatMessageResponse;
import com.example.backend.dto.transaction.chat.SendMessageRequest;
import com.example.backend.entity.ChatMessage;
import com.example.backend.entity.Transaction;
import com.example.backend.entity.User;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.ChatMessageMapper;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final WebSocketEventPublisher webSocketService;

    @Transactional
    public ChatMessageResponse sendMessage(UUID senderid, SendMessageRequest request) {
        log.info("User {} sending message to transaction {}",
                senderid, request.getTransactionid());

        // Validate transaction
        Transaction transaction = transactionRepository
                .findById(request.getTransactionid())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giao dịch với id "+request.getTransactionid()));

        // Validate quyền (chỉ buyer hoặc seller của transaction)
        User sender = userRepository.findById(senderid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user với id "+ senderid));

        if (!transaction.getBuyer().getUserid().equals(senderid) &&
                !transaction.getSeller().getUserid().equals(senderid)) {
            throw new ForbiddenException("Bạn không có quyền chat trong giao dịch này");
        }

        // Tạo message
        ChatMessage message = ChatMessage.builder()
                .transaction(transaction)
                .sender(sender)
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .attachmentUrl(request.getAttachmentUrl())
                .isRead(false)
                .build();

        message = chatMessageRepository.save(message);

        // Convert to response
        ChatMessageResponse response = chatMessageMapper.toResponse(message);
        response.setIsSentByMe(true);

        // Gửi qua WebSocket
        webSocketService.sendMessageToTransaction(transaction.getTransactionid(), response);

        log.info("Message {} sent successfully", message.getMessageid());

        return response;
    }

    public Page<@NotNull ChatMessageResponse> getMessages(UUID userid, Long transactionid,
                                                          Pageable pageable) {
        // Validate quyền
        Transaction transaction = transactionRepository.findById(transactionid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giao dịch với id "+ transactionid));

        if (!transaction.getBuyer().getUserid().equals(userid) &&
                !transaction.getSeller().getUserid().equals(userid)) {
            throw new ForbiddenException("Bạn không có quyền xem tin nhắn này");
        }

        // Lấy messages
        return chatMessageRepository
                .findByTransactionTransactionidOrderByCreatedAtAsc(transactionid, pageable)
                .map(message -> {
                    ChatMessageResponse response = chatMessageMapper.toResponse(message);
                    response.setIsSentByMe(message.getSender().getUserid().equals(userid));
                    return response;
                });
    }

    public ChatConversationResponse getConversation(UUID userid, Long transactionid) {
        Transaction transaction = transactionRepository.findById(transactionid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giao dịch với id "+ transactionid));

        // Validate quyền
        if (!transaction.getBuyer().getUserid().equals(userid) &&
                !transaction.getSeller().getUserid().equals(userid)) {
            throw new ForbiddenException("Bạn không có quyền xem cuộc trò chuyện này");
        }

        // Xác định "người còn lại" trong conversation
        User otherUser = transaction.getBuyer().getUserid().equals(userid) ?
                transaction.getSeller() : transaction.getBuyer();

        // Lấy tất cả messages
        List<ChatMessageResponse> messages = chatMessageRepository
                .findByTransactionTransactionidOrderByCreatedAtAsc(transactionid)
                .stream()
                .map(message -> {
                    ChatMessageResponse response = chatMessageMapper.toResponse(message);
                    response.setIsSentByMe(message.getSender().getUserid().equals(userid));
                    return response;
                })
                .collect(Collectors.toList());

        // Đếm unread
        Long unreadCount = chatMessageRepository.countUnreadMessages(transactionid, userid);

        // Tin nhắn cuối
        ChatMessage lastMessage = chatMessageRepository
                .findLastMessageByTransaction(transactionid);

        return ChatConversationResponse.builder()
                .transactionid(transactionid)
                .productName(transaction.getProduct().getTenSanPham())
                .productImage(transaction.getProduct().getImages().getFirst().getUrlAnh())
                .otherUserId(otherUser.getUserid())
                .otherUserName(otherUser.getHoVaTen())
                .otherUserAvatar(otherUser.getAnhDaiDien())
                .otherUserOnline(false) // TODO: Implement online status
                .lastMessage(lastMessage != null ? lastMessage.getMessageContent() : null)
                .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : null)
                .unreadCount(unreadCount)
                .messages(messages)
                .build();
    }

    /**
     * ĐÁNH DẤU ĐÃ ĐỌC
     */
    @Transactional
    public void markAsRead(UUID userid, Long transactionid) {
        Transaction transaction = transactionRepository.findById(transactionid)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giao dịch với id "+ transactionid));

        // Validate quyền
        if (!transaction.getBuyer().getUserid().equals(userid) &&
                !transaction.getSeller().getUserid().equals(userid)) {
            throw new ForbiddenException("Bạn không có quyền");
        }

        chatMessageRepository.markAllAsRead(transactionid, userid);

        // Notify qua WebSocket
        webSocketService.notifyMessagesRead(transactionid, userid);

        log.info("Marked messages as read for user {} in transaction {}",
                userid, transactionid);
    }

    /**
     * ĐẾM TIN NHẮN CHƯA ĐỌC
     */
    public Long getUnreadCount(UUID userid, Long transactionid) {
        return chatMessageRepository.countUnreadMessages(transactionid, userid);
    }

    /**
     * LẤY DANH SÁCH CONVERSATIONS CỦA USER
     */
    public List<ChatConversationResponse> getMyConversations(UUID userid) {
        List<Transaction> transactions = chatMessageRepository
                .findTransactionsWithMessagesByUser(userid);

        return transactions.stream()
                .map(transaction -> {
                    User otherUser = transaction.getBuyer().getUserid().equals(userid) ?
                            transaction.getSeller() : transaction.getBuyer();

                    ChatMessage lastMessage = chatMessageRepository
                            .findLastMessageByTransaction(transaction.getTransactionid());

                    Long unreadCount = chatMessageRepository
                            .countUnreadMessages(transaction.getTransactionid(), userid);

                    return ChatConversationResponse.builder()
                            .transactionid(transaction.getTransactionid())
                            .productName(transaction.getProduct().getTenSanPham())
                            .productImage(transaction.getProduct().getImages().getFirst().getUrlAnh())
                            .otherUserId(otherUser.getUserid())
                            .otherUserName(otherUser.getHoVaTen())
                            .otherUserAvatar(otherUser.getAnhDaiDien())
                            .lastMessage(lastMessage != null ?
                                    lastMessage.getMessageContent() : null)
                            .lastMessageTime(lastMessage != null ?
                                    lastMessage.getCreatedAt() : null)
                            .unreadCount(unreadCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllMessages(Long transactionid) {
        chatMessageRepository.deleteByTransactionTransactionid(transactionid);
        log.info("Deleted all messages from transaction {}", transactionid);
    }
}
