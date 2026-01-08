package com.example.backend.controller.ws;

import com.example.backend.dto.websocket.TypingIndicator;
import com.example.backend.service.WebSocketEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@Slf4j
public class WSChatController {
    private final WebSocketEventPublisher webSocketService;

    public WSChatController(WebSocketEventPublisher webSocketService) {
        this.webSocketService = webSocketService;
    }


    /**
     * XỬ LÝ TYPING INDICATOR
     * Client gửi: /app/chat/{transactionid}/typing
     */
    @MessageMapping("/chat/{transactionid}/typing")
    public void handleTyping(
            @DestinationVariable Long transactionid,
            @Payload TypingIndicator indicator,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null) {
            log.warn("Typing indicator received from unauthenticated user");
            return;
        }

        String sub = jwt.getSubject();
        if (sub != null) {
            UUID userId = UUID.fromString(sub);

            // Set UserID từ token
            indicator.setUserid(userId);

            // Set Username (Lấy từ claim 'preferred_username', 'name' hoặc fallback về sub)
            String username = jwt.getClaimAsString("username");
            indicator.setUsername(username);

            log.debug("User {} typing in transaction {}", userId, transactionid);

            webSocketService.sendTypingIndicator(transactionid, indicator);
        }
    }

    /**
     * THÔNG BÁO USER ONLINE
     * Client gửi: /app/user/online
     */
    @MessageMapping("/user/online")
    public void handleUserOnline(@AuthenticationPrincipal Jwt jwt) {
        if (jwt != null && jwt.getSubject() != null) {
            UUID userId = UUID.fromString(jwt.getSubject());

            webSocketService.notifyUserStatus(userId, true);
            log.info("User {} is online", userId);
        }
    }

    /**
     * THÔNG BÁO USER OFFLINE
     * Client gửi: /app/user/offline
     */
    @MessageMapping("/user/offline")
    public void handleUserOffline(@AuthenticationPrincipal Jwt jwt) {
        if (jwt != null && jwt.getSubject() != null) {
            UUID userId = UUID.fromString(jwt.getSubject());

            webSocketService.notifyUserStatus(userId, false);
            log.info("User {} is offline", userId);
        }
    }
}
