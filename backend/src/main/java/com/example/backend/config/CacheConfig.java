package com.example.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;

import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.cfg.DateTimeFeature;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.jsontype.PolymorphicTypeValidator;
import tools.jackson.databind.DefaultTyping;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @Primary
    public JsonMapper redisJsonMapper() {
        // Tạo PolymorphicTypeValidator để bảo mật type handling
        PolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.example")  // Thay bằng package thực tế của bạn
                .allowIfSubType(java.util.List.class)
                .allowIfSubType(java.util.Map.class)
                .allowIfSubTypeIsArray()
                .build();

        // Jackson 3: Sử dụng JsonMapper.builder() với immutable pattern
        return JsonMapper.builder()
                // Jackson 3: WRITE_DATES_AS_TIMESTAMPS đã chuyển thành DateTimeFeature
                // Default đã là false (serialize as ISO-8601), nhưng explicit disable để rõ ràng
                .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
                // Không fail khi gặp properties không biết
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                // Jackson 3: activateDefaultTypingAsProperty với typeValidator
                // DefaultTyping enum đã move ra ngoài ObjectMapper
                .activateDefaultTypingAsProperty(typeValidator, DefaultTyping.NON_FINAL, "@class")
                .build();
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory, JsonMapper redisJsonMapper) {
        // Jackson 3: Sử dụng GenericJacksonJsonRedisSerializer với JsonMapper
        GenericJacksonJsonRedisSerializer serializer = new GenericJacksonJsonRedisSerializer(redisJsonMapper);

        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                .disableCachingNullValues();

        return RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory, JsonMapper redisJsonMapper) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Jackson 3: Sử dụng GenericJacksonJsonRedisSerializer
        GenericJacksonJsonRedisSerializer serializer = new GenericJacksonJsonRedisSerializer(redisJsonMapper);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}