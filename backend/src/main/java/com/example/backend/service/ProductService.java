package com.example.backend.service;

import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.entity.*;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository  productImageRepository;
    private final UpgradeRequestRepository upgradeRequestRepository;
    private final ProductMapper productMapper;
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository, ProductImageRepository productImageRepository, UpgradeRequestRepository upgradeRequestRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.productImageRepository = productImageRepository;
        this.upgradeRequestRepository = upgradeRequestRepository;
        this.productMapper = productMapper;
    }

    @Transactional
    public ProductResponse createProduct(UUID sellerId, CreateProductRequest request) {
        // 1. Lấy thông tin Seller & Category
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại"));

        if (seller.getVaitro() != Role.SELLER) {
            throw new AccessDeniedException("Bạn chưa được cấp quyền đăng bán sản phẩm");
        }

        if(seller.getThoiHanBanHang() == null || LocalDateTime.now().isAfter(seller.getThoiHanBanHang())){
            throw new AccessDeniedException("Quyền bán hàng của bạn chưa được duyệt hoặc đã hết hạn, vui lòng đăng ký hoặc chờ đợi thêm");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Danh mục không tồn tại"));

        Product product = productMapper.toEntity(request);

        product.setSeller(seller);
        product.setCategory(category);
        product.setGiaHienTai(request.getGiaKhoiDiem());
        product.setTrangThai(ProductStatus.PENDING);
        product.setThoiGianKetThuc(LocalDateTime.now().plusHours(request.getDurationInHours()));
        product.setSoLuotRaGia(0);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();

            for (int i = 0; i < request.getImages().size(); i++) {
                ProductImage image = ProductImage.builder()
                        .product(product)
                        .urlAnh(request.getImages().get(i))
                        .thuTu(i + 1)
                        .build();
                productImages.add(image);
            }
            product.setImages(productImages);
        }

        Product savedProduct = productRepository.save(product);

        ProductResponse result = productMapper.toResponse(savedProduct);
        result.setImages(request.getImages());
        return result;
    }
}
