package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_bidders",
        uniqueConstraints = @UniqueConstraint(columnNames = {"productid", "bidderid"}),
        indexes = {
                @Index(name = "idx_blocked_product", columnList = "productid"),
                @Index(name = "idx_blocked_bidder", columnList = "bidderid")
        })
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlockedBidder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blockid")
    Long blockid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidderid", nullable = false)
    User bidder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid", nullable = false)
    User seller;

    @Column(name = "ly_do", columnDefinition = "nvarchar(500)")
    String lyDo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}