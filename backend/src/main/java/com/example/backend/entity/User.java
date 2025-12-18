package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "User", indexes = {
        @Index(name = "idx_user_hoVaTen", columnList = "hoVaTen"),
        @Index(name = "idx_user_vaitro", columnList = "vaitro")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "userid", updatable = false, columnDefinition = "char(36)")
    private UUID userid;

    @Column(name = "username", length = 30, unique = true, nullable = false)
    private String username;

    @Column(name = "password", length = 60, nullable = false)
    private String password;

    @Column(name = "email", length = 255, unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "vaitro", nullable = false)
    private Role vaitro;

    @Column(name = "hoVaTen", length = 50, columnDefinition = "nvarchar(50)")
    private String hoVaTen;

    @Column(name = "anhDaiDien", length = 100)
    private String anhDaiDien;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
