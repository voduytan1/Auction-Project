package com.example.backend.config;


import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
            request.anyRequest().authenticated();
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