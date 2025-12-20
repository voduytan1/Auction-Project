package com.example.backend.entity;

import com.example.backend.entity.UpgradeRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "upgrade_requests", indexes = {
        @Index(name = "idx_upgrade_user", columnList = "userid"),
        @Index(name = "idx_upgrade_status", columnList = "trang_thai")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpgradeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requestid")
    Long requestid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    UpgradeRequestStatus trangThai = UpgradeRequestStatus.PENDING;

    @Column(name = "ly_do", columnDefinition = "nvarchar(500)")
    String lyDo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_adminid")
    User approvedByAdmin;

    @Column(name = "ghi_chu_admin", columnDefinition = "nvarchar(500)")
    String ghiChuAdmin;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}