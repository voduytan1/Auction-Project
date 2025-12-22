package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "product_images", indexes = {
        @Index(name = "idx_product_image_product", columnList = "productid")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imageid")
    Long imageid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    @ToString.Exclude
    Product product;

    @Column(name = "url_anh", length = 255, nullable = false)
    String urlAnh;

    @Column(name = "public_id", length = 255)
    String publicId;

    @Column(name = "thu_tu")
    Integer thuTu;
}