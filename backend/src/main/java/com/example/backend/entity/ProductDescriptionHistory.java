package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_description_history", indexes = {
        @Index(name = "idx_desc_history_product", columnList = "productid"),
        @Index(name = "idx_desc_history_time", columnList = "thoi_gian_them")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDescriptionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "desc_historyid")
    Long descHistoryid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @Column(name = "noi_dung_them", columnDefinition = "TEXT", nullable = false)
    String noiDungThem;

    @CreationTimestamp
    @Column(name = "thoi_gian_them", nullable = false)
    LocalDateTime thoiGianThem;
}