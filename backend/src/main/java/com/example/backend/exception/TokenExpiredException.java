package com.example.backend.exception;

public class TokenExpiredException extends JwtAuthenticationException{
    public TokenExpiredException(String message){
        super(message);
    }
}