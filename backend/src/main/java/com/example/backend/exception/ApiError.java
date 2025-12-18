package com.example.backend.exception;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class ApiError {
    private OffsetDateTime timestamp = OffsetDateTime.now();
    private int status;
    private String error;
    private String message;
    private String path;
}