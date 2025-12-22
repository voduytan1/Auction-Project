package com.example.backend.dto.image;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class imageResponse {
    String url;
    String publicId;
    int height;
    int width;
    int bytes;
}
