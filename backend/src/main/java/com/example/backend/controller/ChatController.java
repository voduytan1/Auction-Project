package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.transaction.chat.ChatConversationResponse;
import com.example.backend.dto.transaction.chat.ChatMessageResponse;
import com.example.backend.dto.transaction.chat.SendMessageRequest;
import com.example.backend.service.ChatService;
import com.example.backend.utils.PageUtils;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<@NotNull ApiResponse<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if(sub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChatMessageResponse response = chatService.sendMessage(UUID.fromString(sub), request);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/transaction/{transactionid}")
    public ResponseEntity<@NotNull ApiResponse<List<ChatMessageResponse>>> getMessages(
            @PathVariable Long transactionid,
            @ModelAttribute @Valid PaginationRequest paginationRequest,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Pageable pageable = paginationRequest.getPageable();

        Page<@NotNull ChatMessageResponse> result = chatService.getMessages(
                UUID.fromString(sub), // userid là UUID
                transactionid,
                pageable
        );
        PaginationInfo paginationInfo = PageUtils.fromPage(result, paginationRequest.getTrimmedSearch());

        String message = "Lấy danh sách tin nhắn thành công";

        return ResponseEntity.ok(ApiResponse.successWithPagination(
                message,
                result.getContent(),
                paginationInfo
        ));
    }

    @GetMapping("/conversation/{transactionid}")
    public ResponseEntity<@NotNull ApiResponse<ChatConversationResponse>> getConversation(
            @PathVariable Long transactionid,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        ChatConversationResponse response = chatService.getConversation(
                UUID.fromString(sub),
                transactionid
        );

        return ResponseEntity.ok(ApiResponse.success(response));
    }
    /**
     * ĐÁNH DẤU ĐÃ ĐỌC
     */
    @PostMapping("/transaction/{transactionid}/read")
    public ResponseEntity<@NotNull ApiResponse<Void>> markAsRead(
            @PathVariable Long transactionid,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        chatService.markAsRead(UUID.fromString(sub), transactionid);

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /**
     * ĐẾM TIN NHẮN CHƯA ĐỌC
     */
    @GetMapping("/transaction/{transactionid}/unread")
    public ResponseEntity<@NotNull ApiResponse<Long>> getUnreadCount(
            @PathVariable Long transactionid,
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Long count = chatService.getUnreadCount(UUID.fromString(sub), transactionid);

        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * LẤY DANH SÁCH CONVERSATIONS
     */
    @GetMapping("/conversations")
    public ResponseEntity<@NotNull ApiResponse<List<ChatConversationResponse>>> getMyConversations(
            @AuthenticationPrincipal Jwt jwt) {

        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<ChatConversationResponse> response = chatService.getMyConversations(UUID.fromString(sub));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * XÓA CONVERSATION (ADMIN)
     */
    @DeleteMapping("/transaction/{transactionid}")
    public ResponseEntity<@NotNull ApiResponse<Void>> deleteConversation(
            @PathVariable Long transactionid) {

        chatService.deleteAllMessages(transactionid);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
