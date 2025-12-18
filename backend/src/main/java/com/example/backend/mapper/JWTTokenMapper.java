package com.example.backend.mapper;

import com.example.backend.dto.auth.TokenPair;
import com.example.backend.entity.JWTToken;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface JWTTokenMapper {

    @Mapping(target = "expiresAt", source = "refreshTokenExpirationTime")
    JWTToken toEntity(TokenPair tokenPair);
}
