package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_hoVaTen", columnList = "ho_va_ten"),
        @Index(name = "idx_user_vaitro", columnList = "vai_tro")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "userid", updatable = false, columnDefinition = "char(36)")
    UUID userid;

    @Column(name = "username", length = 30, unique = true, nullable = false)
    String username;

    @JsonIgnore
    @Column(name = "password", length = 60, nullable = false)
    String password;

    @Column(name = "email", length = 255, unique = true, nullable = false)
    String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false)
    Role vaitro = Role.BIDDER;

    @Column(name = "thoi_han_ban_hang")
    LocalDateTime thoiHanBanHang;

    @Column(name = "ho_va_ten", length = 50, columnDefinition = "nvarchar(50)")
    String hoVaTen;

    @Column(name = "dia_chi", length = 255, columnDefinition = "nvarchar(255)")
    String diaChi;

    @Column(name = "so_dien_thoai", length = 10)
    String soDienThoai;

    @Column(name = "ngay_sinh")
    LocalDate ngaySinh;

    @Column(name = "diem_danh_gia")
    Double diemDanhGia;

    @Column(name = "anh_dai_dien", length = 255)
    String anhDaiDien;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
