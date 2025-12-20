package com.example.backend.entity;

import com.example.backend.entity.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transaction_product", columnList = "productid"),
        @Index(name = "idx_transaction_buyer", columnList = "buyerid"),
        @Index(name = "idx_transaction_seller", columnList = "sellerid"),
        @Index(name = "idx_transaction_status", columnList = "trang_thai")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transactionid")
    Long transactionid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerid", nullable = false)
    User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid", nullable = false)
    User seller;

    @Column(name = "gia_cuoi_cung", precision = 15, scale = 2, nullable = false)
    BigDecimal giaCuoiCung;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    TransactionStatus trangThai = TransactionStatus.PENDING_PAYMENT;

    @Column(name = "dia_chi_giao_hang", columnDefinition = "nvarchar(500)")
    String diaChiGiaoHang;

    @Column(name = "ma_van_don", length = 100)
    String maVanDon;

    @Column(name = "payment_method", length = 50)
    String paymentMethod;

    @Column(name = "payment_transaction_id", length = 255)
    String paymentTransactionId;

    @Column(name = "thoi_gian_thanh_toan")
    LocalDateTime thoiGianThanhToan;

    @Column(name = "thoi_gian_giao_hang")
    LocalDateTime thoiGianGiaoHang;

    @Column(name = "thoi_gian_nhan_hang")
    LocalDateTime thoiGianNhanHang;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}