package com.example.backend.mapper;


import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.auth.LoginResponseWithRefreshToken;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    LoginResponse toLoginResponse(LoginResponseWithRefreshToken loginResponseWithRefreshToken);
}


