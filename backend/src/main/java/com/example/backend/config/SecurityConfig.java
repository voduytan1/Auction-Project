package com.example.backend.config;


import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.time.Duration;
import java.util.Arrays;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import javax.crypto.spec.SecretKeySpec;

import java.util.Collections;
import java.util.List;
import java.util.Map;


@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {
    private static final Map<String, Map<HttpMethod, String[]>> ROLE_BASED_ENDPOINTS = Map.of(
            "PUBLIC", Map.of(
                    HttpMethod.GET, new String[]{"/auth/**", "/actuator/**", "/categories","/categories/{id}", "/categories/{id}/products", "/categories/{id}/sub-category", "/categories/{id}/products/parent-category","/products", "/products/{id}", "/bids/history/{productId}/get-top", "/questions", "/swagger-ui/**", "/v3/api-docs/**"},
                    HttpMethod.POST, new String[]{"/auth/login", "/users", "/auth/logout", "/auth/refresh", "/payment/webhook", "/rating", "/auth/send-otp", "/auth/google"},
                    HttpMethod.PUT, new String[]{},
                    HttpMethod.PATCH, new String[]{"/auth/forgot-password"}
            ),
            "ADMIN", Map.of(
                    HttpMethod.GET, new String[]{"/admin/**", "/config/**", "/admin/dashboard/**"},
                    HttpMethod.POST, new String[]{"/categories","/admin/**", "/config/**"},
                    HttpMethod.PATCH, new String[]{"/categories/{id}","/admin/**"},
                    HttpMethod.DELETE, new String[]{"/users/{id}","/categories/{id}","/admin/**"}
            ),
            "SELLER",Map.of(
                    HttpMethod.GET, new String[]{},
                    HttpMethod.POST, new String[]{"/products"},
                    HttpMethod.PATCH, new String[]{},
                    HttpMethod.DELETE, new String[]{}
            ),
            "BIDDER",Map.of(
                    HttpMethod.GET, new String[]{},
                    HttpMethod.POST, new String[]{},
                    HttpMethod.PATCH, new String[]{},
                    HttpMethod.DELETE, new String[]{}
            ),
            "AUTHENTICATED",Map.of(
                    HttpMethod.GET, new String[]{"/users/me", "/bids/**", "/bids/history/{productId}", "/transactions/buyer", "/transactions/seller","/transactions/{id}", "/theo-doi", "/rating/mine","/rating/{id}"},
                    HttpMethod.POST, new String[]{"/users/request-seller", "/images/**","/image/**", "/bids/**", "/payment/create-checkout-session", "/transactions/{id}/dia-chi", "/transactions/{id}/hoan-thanh", "/theo-doi", "/questions", "/transactions/{id}/ma-van-don", "/transactions/{id}/huy", "/products/block"},
                    HttpMethod.PUT, new String[]{"/users/{id}"},
                    HttpMethod.PATCH, new String[]{"/products", "/questions/{id}"},
                    HttpMethod.DELETE, new String[]{"/theo-doi"}
            )
    );
    
    @Value("${jwt.secret.key}")
    private String jwtSecretKey;

//    @Value("${REPORT_URI}")
//    private String reportUri;

    @Value("${ALLOW_ORIGINS}")
    private String allowedOriginsProp;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        httpSecurity.authorizeHttpRequests(request -> {
            request.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll(); //Preflight
            request.requestMatchers("/ws/**").permitAll();

            //Public endpoint
            var publicEnpoints = ROLE_BASED_ENDPOINTS.get("PUBLIC");
            publicEnpoints.forEach((method, endpoints) ->
                    request.requestMatchers(method, endpoints).permitAll()
            );


            var authenticatedEndpoints = ROLE_BASED_ENDPOINTS.get("AUTHENTICATED");
            authenticatedEndpoints.forEach((method, endpoints) ->
                    request.requestMatchers(method, endpoints).authenticated()
            );

            //SELLER endpoint
            var sellerEndpoints = ROLE_BASED_ENDPOINTS.get("SELLER");
            sellerEndpoints.forEach((method, endpoints) ->
                    request.requestMatchers(method, endpoints).hasRole("SELLER")
            );

            //BIDDER endpoint
            var bidderEndpoints = ROLE_BASED_ENDPOINTS.get("BIDDER");
            bidderEndpoints.forEach((method, endpoints) ->
                    request.requestMatchers(method, endpoints).hasRole("BIDDER")
            );


            //ADMIN endpoint
            var adminEndpoints = ROLE_BASED_ENDPOINTS.get("ADMIN");
            adminEndpoints.forEach((method, endpoints) ->
                    request.requestMatchers(method, endpoints).hasRole("ADMIN")
            );
            request.anyRequest().hasRole("ADMIN");
        });

        httpSecurity.headers(headers -> headers
                //Content type mặc định được tự động bật nonsniff
                //X-frame-option mặc định cũng đã deny
                //Cache-control và Pragme mặc định cũng là no-cache
//                .contentSecurityPolicy(csp ->csp
//                        .policyDirectives("default-src 'none'; report-uri " + reportUri)
//                )
                .xssProtection(HeadersConfigurer.XXssConfig::disable)
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
        );
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .bearerTokenResolver(request -> {
                            String authorization = request.getHeader("Authorization");
                            if (authorization != null && authorization.startsWith("Bearer ")) {
                                return authorization.substring(7);
                            }
                            // Nếu không có header, trả về null. Spring sẽ tự xử lý phần còn lại.
                            return null;
                        })
        );

        httpSecurity.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        return httpSecurity.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(jwtSecretKey.getBytes(), "HS256");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            // Lấy role từ JWT claim "vaitro"
            String role = jwt.getClaimAsString("vaitro");

            log.info("JWT Role from token: {}", role); // ✅ Debug log

            if (role != null) {
                // ✅ Thêm prefix ROLE_ như Spring Security expect
                return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
            }
            return Collections.emptyList();
        });

        converter.setPrincipalClaimName("sub");
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        List<String> allowedOrigins = Arrays.stream(allowedOriginsProp.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        CorsConfiguration corsConfiguration = getCorsConfiguration(allowedOrigins);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }

    @NotNull
    private static CorsConfiguration getCorsConfiguration(List<String> allowedOrigins) {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOrigins(allowedOrigins);

        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        corsConfiguration.setAllowedHeaders(List.of("*"));

        corsConfiguration.setExposedHeaders(List.of("Authorization","Content-Disposition"));

        corsConfiguration.setAllowCredentials(true);

        corsConfiguration.setMaxAge(Duration.ofHours(1));
        return corsConfiguration;
    }
}