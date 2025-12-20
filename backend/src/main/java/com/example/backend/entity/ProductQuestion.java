package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_questions", indexes = {
        @Index(name = "idx_question_product", columnList = "productid"),
        @Index(name = "idx_question_asker", columnList = "askerid")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questionid")
    Long questionid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "askerid", nullable = false)
    User asker;

    @Column(name = "noi_dung_cau_hoi", columnDefinition = "TEXT", nullable = false)
    String noiDungCauHoi;

    @Column(name = "noi_dung_tra_loi", columnDefinition = "TEXT")
    String noiDungTraLoi;

    @CreationTimestamp
    @Column(name = "thoi_gian_hoi", nullable = false)
    LocalDateTime thoiGianHoi;

    @Column(name = "thoi_gian_tra_loi")
    LocalDateTime thoiGianTraLoi;
}