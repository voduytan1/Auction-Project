package com.example.backend.service;

import com.example.backend.dto.auth.RecaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${google.recaptcha.verify.url}")
    private String recaptchaVerifyUrl;

    // Dùng RestTemplate để gọi API bên ngoài
    private final RestTemplate restTemplate;

    public RecaptchaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean validateToken(String recaptchaToken) {
        // Tạo body request
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        param.add("secret", recaptchaSecret);
        param.add("response", recaptchaToken);

        // Gọi API Google
        RecaptchaResponse apiResponse = null;
        try {
            apiResponse = restTemplate.postForObject(recaptchaVerifyUrl, param, RecaptchaResponse.class);
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Nếu lỗi mạng hoặc gọi API fail thì coi như fail
        }

        // Kiểm tra kết quả trả về
        return apiResponse != null && apiResponse.isSuccess();
    }
}
