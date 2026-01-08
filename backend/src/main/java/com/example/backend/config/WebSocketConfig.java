package com.example.backend.config;

import com.example.backend.utils.AuthUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AuthUtils authUtils;

    public WebSocketConfig(AuthUtils authUtils) {
        this.authUtils = authUtils;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint với SockJS (recommend)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addEndpoint("/ws-native")
                .setAllowedOrigins("*");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(128 * 1024); // 128KB
        registration.setSendBufferSizeLimit(512 * 1024); // 512KB
        registration.setSendTimeLimit(20 * 1000); // 20 seconds
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // Chỉ kiểm tra khi client thực hiện lệnh CONNECT
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    // 1. Lấy token từ header Authorization
                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String token = authorizationHeader.substring(7);

                        try {
                            // 2. Validate token bằng AuthUtils của bạn
                            // Hàm này sẽ ném Exception nếu token sai/hết hạn
                            // Nếu đúng, nó trả về JWTClaimsSet chứa thông tin user
                            JWTClaimsSet claims = authUtils.validateAccessToken(token);

                            // 3. Trích xuất thông tin từ Claims
                            String userId = claims.getSubject(); // Lấy UserID (UUID string)
                            String username = (String) claims.getClaim("username");
                            String role = (String) claims.getClaim("vaitro");

                            // 4. Tạo quyền (Authorities)
                            // Spring Security cần ROLE_ ở trước (tuỳ config của bạn)
                            // Nếu role trong DB là "BIDDER" -> "ROLE_BIDDER"
                            List<SimpleGrantedAuthority> authorities = role != null
                                    ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                                    : Collections.emptyList();

                            // 5. Tạo Authentication Object chuẩn của Spring Security
                            // Principal: userId (để nhất quán với AuthUtils.getID())
                            // Credentials: null (không cần password)
                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(userId, null, authorities);

                            // 6. Gán User vào phiên WebSocket
                            accessor.setUser(auth);

                            log.info("WebSocket Connected: UserID={} Username={}", userId, username);

                        } catch (Exception e) {
                            // Nếu validate thất bại (Token hết hạn, chữ ký sai...)
                            log.error("WebSocket Auth Failed: {}", e.getMessage());
                            // Không set User -> Kết nối sẽ bị coi là Anonymous hoặc bị từ chối tuỳ Security Config
                        }
                    }
                }
                return message;
            }
        });
    }
}