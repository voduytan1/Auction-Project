package com.example.backend.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class MyStringUtils {

    public static String removeAccents(String text) {
        if (text == null) return null;

        // 1. Chuyển về chữ thường
        String temp = text.trim().toLowerCase();

        // 2. Xử lý chữ Đ/đ (Normalizer không tự tách đ thành d)
        temp = temp.replaceAll("đ", "d");

        // 3. Tách dấu ra khỏi ký tự (Normalization Form Decomposition)
        temp = Normalizer.normalize(temp, Normalizer.Form.NFD);

        // 4. Dùng Regex để xóa các dấu đã tách
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("");
    }
    /**
     * MASK TÊN BIDDER: "Nguyễn Văn Khoa" -> "****Khoa"
     */
    public static String maskBidderName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "****";
        }
        String[] parts = fullName.trim().split("\\s+");
        String lastName = parts[parts.length - 1];
        return "****" + lastName;
    }
}
