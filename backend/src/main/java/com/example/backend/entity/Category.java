package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "categoryid", updatable = false, columnDefinition = "char(36)")
    UUID categoryid;

    @Column(name = "ten_danh_muc", length = 100, nullable = false, columnDefinition = "nvarchar(100)")
    String tenDanhMuc;

    @Column(name = "level", nullable = false)
    Integer level; // 1 = cấp cha, 2 = cấp con

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_categoryid", columnDefinition = "char(36)")
    Category parentCategory;

    @Column(name = "mo_ta", columnDefinition = "nvarchar(500)")
    String moTa;
}
