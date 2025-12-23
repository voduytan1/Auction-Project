package com.example.backend.service;

import com.example.backend.entity.ProductImage;
import com.example.backend.repository.ProductImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageService {
    private final ProductImageRepository productImageRepository;


    public ProductImageService(ProductImageRepository productImageRepository) {
        this.productImageRepository = productImageRepository;
    }

    public List<ProductImage> getProductImages() {
        return productImageRepository.findAll();
    }

    @Transactional
    public ProductImage CreateOne(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    @Transactional
    public List<ProductImage> CreateBatch(List<ProductImage> productImages) {
        return productImageRepository.saveAll(productImages);
    }
}
