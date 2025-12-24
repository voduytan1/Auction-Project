package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bid_history", indexes = {
        @Index(name = "idx_bid_history_product", columnList = "productid"),
        @Index(name = "idx_bid_history_bidder", columnList = "bidderid"),
        @Index(name = "idx_bid_history_time", columnList = "thoi_gian_dat")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BidHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_historyid")
    Long bidHistoryid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidderid", nullable = false)
    User bidder;

    @Column(name = "gia_dat", precision = 15, scale = 2, nullable = false)
    BigDecimal giaDat;

    @CreationTimestamp
    @Column(name = "thoi_gian_dat", nullable = false)
    LocalDateTime createdAt;
}