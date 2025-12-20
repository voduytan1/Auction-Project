package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", indexes = {
        @Index(name = "idx_rating_rater", columnList = "raterid"),
        @Index(name = "idx_rating_ratee", columnList = "rateeid"),
        @Index(name = "idx_rating_product", columnList = "productid")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ratingid")
    Long ratingid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raterid", nullable = false)
    User rater; // Người đánh giá

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rateeid", nullable = false)
    User ratee; // Người được đánh giá

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @Column(name = "diem", nullable = false)
    Integer diem; // +1 hoặc -1

    @Column(name = "nhan_xet", columnDefinition = "nvarchar(500)")
    String nhanXet;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}