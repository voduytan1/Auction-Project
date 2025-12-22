package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categoryid")
    Long categoryid;

    @Column(name = "ten_danh_muc", length = 100, nullable = false, columnDefinition = "nvarchar(100)")
    String tenDanhMuc;

    @Column(name = "level", nullable = false)
    Integer level; // 1 = cấp cha, 2 = cấp con

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_categoryid")
    Category parentCategory;

    @Column(name = "mo_ta", columnDefinition = "nvarchar(500)")
    String moTa;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
