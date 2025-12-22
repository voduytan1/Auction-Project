package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.dto.image.imageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public imageResponse uploadFile(MultipartFile file) throws IOException {
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "products"
                ));

        return imageResponse.builder()
                .url((String) uploadResult.get("secure_url"))
                .publicId((String) uploadResult.get("public_id"))
                .width((Integer) uploadResult.get("width"))
                .height((Integer) uploadResult.get("height"))
                .bytes((Integer) uploadResult.get("bytes"))
                .build();
    }

    public List<imageResponse> uploadMultipleFiles(List<MultipartFile> files) throws IOException {
        List<imageResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            responses.add(uploadFile(file)); // Tái sử dụng hàm trên
        }
        return responses;
    }
}