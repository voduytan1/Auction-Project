package com.example.backend.service;

import com.example.backend.dto.admin.dashboard.CategoryDistribution;
import com.example.backend.dto.admin.dashboard.NewUserDataPoint;
import com.example.backend.dto.admin.dashboard.ProductDataPoint;
import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.dto.product.filtercriteria.ProductFilterRequest;
import com.example.backend.entity.*;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.*;
import com.example.backend.specification.ProductSpecification;
import com.example.backend.utils.DateUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository  productImageRepository;
    private final BidHistoryRepository bidHistoryRepository;
    private final ProductMapper productMapper;
    private final TransactionRepository transactionRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository, ProductImageRepository productImageRepository, UpgradeRequestRepository upgradeRequestRepository, BidHistoryRepository bidHistoryRepository, ProductMapper productMapper, TransactionRepository transactionRepository, TransactionRepository transactionRepository1) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.productImageRepository = productImageRepository;
        this.bidHistoryRepository = bidHistoryRepository;
        this.productMapper = productMapper;
        this.transactionRepository = transactionRepository1;
    }

    @Transactional
    public ProductResponse createProduct(UUID sellerId, CreateProductRequest request) {
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
        product.setTrangThai(ProductStatus.ACTIVE);
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

    @Transactional
    public Page<@NotNull ProductResponse> getAllProducts(ProductFilterRequest criteria, Pageable pageable) {
        Specification<@NotNull Product> spec = ProductSpecification.getFilter(criteria);

        Page<@NotNull Product> productPage = productRepository.findAll(spec, pageable);

        return productPage.map(productMapper::toResponse);
    }

    @Transactional
    public ProductResponse getProductById(Long id) {
         Product product = productRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy product với id "+ id));
         Transaction transaction = transactionRepository.findByProduct_Productid(id).orElse(null);

        ProductResponse response = productMapper.toResponse(product);
        response.setTransactionId(transaction ==  null ? null : transaction.getTransactionid());
        return response;
    }

    public List<ProductDataPoint> getNewProductChart() {
        List<ProductDataPoint> data = new ArrayList<>();

        for(int i = 1; i <= 12; i++) {
            LocalDateTime start = DateUtils.getStartOfSpecificMonth(i);
            LocalDateTime end = DateUtils.getEndOfSpecificMonth(i);
            Long newProduct = productRepository.countByTrangThaiAndCreatedAtBetween(ProductStatus.ACTIVE,start, end);
            Long completedProduct = productRepository.countByTrangThaiAndUpdatedAtBetween(ProductStatus.COMPLETED,start, end);

            data.add(new ProductDataPoint(i, newProduct, completedProduct));
        }
        return data;
    }

    public List<CategoryDistribution> getProductByCategoriesChart() {
        return productRepository.countProductsGroupedByRootCategory();
    }

    @Transactional
    public Page<@NotNull ProductResponse> getProductByCategory(Long categoryId, String search, Pageable pageable) {
        Page<@NotNull Product> productPage = productRepository.findByRootCategoryAndSearch(categoryId, search, pageable);
        return productPage.map(productMapper::toResponse);
    }
}
