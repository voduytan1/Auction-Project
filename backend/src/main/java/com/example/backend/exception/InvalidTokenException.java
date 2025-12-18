package com.example.backend.exception;

public class InvalidTokenException extends JwtAuthenticationException{
    public  InvalidTokenException(String message){
        super(message);
    }
}
