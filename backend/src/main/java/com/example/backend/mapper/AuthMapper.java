package com.example.backend.mapper;


import com.example.backend.dto.auth.FullRefreshTokenResponse;
import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.auth.LoginResponseWithRefreshToken;
import com.example.backend.dto.auth.RefreshTokenResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    LoginResponse toLoginResponse(LoginResponseWithRefreshToken loginResponseWithRefreshToken);

    RefreshTokenResponse toRefreshTokenResponse(FullRefreshTokenResponse fullRefreshTokenResponse);
}


