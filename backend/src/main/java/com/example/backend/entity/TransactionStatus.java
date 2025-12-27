package com.example.backend.entity;

public enum TransactionStatus {
    PENDING_PAYMENT,        // Chờ thanh toán
    PAYMENT_COMPLETED,      // Đã thanh toán
    AWAITING_SHIPMENT,    // Chờ gửi hàng
    SHIPPED,                // Đã gửi hàng
    DELIVERED,              // Đã nhận hàng
    COMPLETED,              // Hoàn tất
    CANCELLED               // Đã hủy
}
