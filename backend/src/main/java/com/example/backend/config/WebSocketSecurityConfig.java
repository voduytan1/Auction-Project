package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfig {

    @Bean
    public AuthorizationManager<Message<?>> messageAuthorizationManager(
            MessageMatcherDelegatingAuthorizationManager.Builder messages) {

        messages
                .nullDestMatcher().permitAll() // Cho phép CONNECT frame
                .simpSubscribeDestMatchers("/topic/**", "/queue/**").permitAll() // Cho phép subscribe
                .simpDestMatchers("/app/**").permitAll() // Cho phép send
                .anyMessage().permitAll(); // Cho phép tất cả (tạm thời để test)

        return messages.build();
    }
}