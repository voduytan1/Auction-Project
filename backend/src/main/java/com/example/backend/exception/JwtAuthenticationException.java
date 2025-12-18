package com.example.backend.exception;

public class JwtAuthenticationException extends RuntimeException {
    public JwtAuthenticationException(String message){
        super(message);
    }
}