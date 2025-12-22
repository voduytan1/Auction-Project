package com.example.backend.controller;

import com.example.backend.dto.image.imageResponse;
import com.example.backend.service.CloudinaryService;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/images")
public class FileUploadController {
    private final CloudinaryService cloudinaryService;

    public FileUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }


    @PostMapping("/upload")
    public ResponseEntity<@NotNull imageResponse> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            imageResponse data = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(data);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<@NotNull List<imageResponse>> uploadMultipleImages(@RequestParam("images") List<MultipartFile> files) {
        try {
            if (files == null || files.isEmpty()) return ResponseEntity.badRequest().build();

            List<imageResponse> data = cloudinaryService.uploadMultipleFiles(files);
            return ResponseEntity.ok(data);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
