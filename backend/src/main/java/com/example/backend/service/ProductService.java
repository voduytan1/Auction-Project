package com.example.backend.service;

import com.example.backend.dto.admin.dashboard.CategoryDistribution;
import com.example.backend.dto.admin.dashboard.NewUserDataPoint;
import com.example.backend.dto.admin.dashboard.ProductDataPoint;
import com.example.backend.dto.admin.dashboard.TopAuctionsResponse;
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
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository  productImageRepository;
    private final BidHistoryRepository bidHistoryRepository;
    private final ProductMapper productMapper;
    private final TransactionRepository transactionRepository;
    private final AutoBidRepository autoBidRepository;
    private final TransactionService transactionService;
    private final EmailService emailService;
    private final ConfigurationService configurationService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository, ProductImageRepository productImageRepository, UpgradeRequestRepository upgradeRequestRepository, BidHistoryRepository bidHistoryRepository, ProductMapper productMapper, TransactionRepository transactionRepository, TransactionRepository transactionRepository1, AutoBidRepository autoBidRepository, TransactionService transactionService, EmailService emailService, ConfigurationService configurationService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.productImageRepository = productImageRepository;
        this.bidHistoryRepository = bidHistoryRepository;
        this.productMapper = productMapper;
        this.transactionRepository = transactionRepository1;
        this.autoBidRepository = autoBidRepository;
        this.transactionService = transactionService;
        this.emailService = emailService;
        this.configurationService = configurationService;
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
        int year = LocalDateTime.now() .getYear();
        for(int i = 1; i <= 12; i++) {
            LocalDateTime start = DateUtils.getStartOfSpecificMonth(i, year);
            LocalDateTime end = DateUtils.getEndOfSpecificMonth(i, year);
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

    public Long countActive(){
        return productRepository.countByTrangThai(ProductStatus.ACTIVE);
    }

    public Long countActiveToday(){
        return productRepository.countByTrangThaiAndCreatedAtBetween(ProductStatus.ACTIVE, DateUtils.getStartOfToday(), DateUtils.getEndOfToday());
    }

    public List<TopAuctionsResponse> getTop3ProductByPrice(){
        List<Product> products = productRepository.findTop3ByTrangThaiOrderByGiaHienTaiDesc(ProductStatus.ACTIVE);
        return products.stream()
                .map(productMapper::toTopAuctionsResponse)
                .toList();
    }

    @Transactional
    public void processExpiredProduct(Product product) {
        try {
            log.info("Processing expired product: {} (ID: {})",
                    product.getTenSanPham(), product.getProductid());

            // Chuyển trạng thái sang COMPLETED
            product.setTrangThai(ProductStatus.COMPLETED);
            productRepository.save(product);

            List<AutoBid> activeAutoBids = autoBidRepository
                    .findActiveAutoBidsByProductOrderByGiaToiDaDesc(product.getProductid());
            activeAutoBids.forEach(ab -> ab.setIsActive(false));
            autoBidRepository.saveAll(activeAutoBids);

            if (product.getCurrentBidder() != null) {
                // CÓ NGƯỜI THẮNG - Tạo transaction
                Transaction transaction = Transaction.builder()
                        .product(product)
                        .buyer(product.getCurrentBidder())
                        .seller(product.getSeller())
                        .giaCuoiCung(product.getGiaHienTai())
                        .trangThai(TransactionStatus.PENDING_PAYMENT)
                        .paymentMethod("Stripe")
                        .build();

                Transaction transactionResult = transactionService.createTransaction(transaction);

                // Gửi email cho seller
                emailService.sendAuctionSuccessToSeller(
                        product.getSeller().getEmail(),
                        product.getSeller().getHoVaTen(), // Hoặc getUsername()
                        product.getTenSanPham(),
                        product.getGiaHienTai(),
                        product.getCurrentBidder().getHoVaTen(),
                        product.getProductid()
                );

                // Gửi email cho winner
                emailService.sendAuctionSuccessToWinner(
                        product.getCurrentBidder().getEmail(),
                        product.getCurrentBidder().getHoVaTen(),
                        product.getTenSanPham(),
                        product.getGiaHienTai(),
                        product.getProductid()
                );

                log.info("Product {} completed with winner: {}",
                        product.getProductid(),
                        product.getCurrentBidder().getUsername());
            } else {
                // KHÔNG CÓ NGƯỜI THẮNG, gửi mail cho người bán
                emailService.sendAuctionFailToSeller(
                        product.getSeller().getEmail(),
                        product.getSeller().getHoVaTen(),
                        product.getTenSanPham(),
                        product.getProductid()
                );

                log.info("Product {} completed with no winner",
                        product.getProductid());
            }
        } catch (Exception e) {
            log.error("Error processing expired product {}: {}",
                    product.getProductid(), e.getMessage(), e);
        }
    }

    @Transactional
    public void checkAndExtendProduct(Product product, int checkWindowMinutes, int extensionMinutes) {
        try {
            LocalDateTime checkFrom = product.getThoiGianKetThuc()
                    .minusMinutes(checkWindowMinutes);
            LocalDateTime now = LocalDateTime.now();

            // Check có bid mới trong khoảng thời gian check window không
            boolean hasRecentBid = bidHistoryRepository
                    .existsByProductAndCreatedAtBetween(
                            product, checkFrom, now
                    );

            if (hasRecentBid) {
                // Gia hạn thêm
                LocalDateTime newEndTime = now.plusMinutes(extensionMinutes);
                product.setThoiGianKetThuc(newEndTime);
                productRepository.save(product);

                log.info("✅ Extended product {} until {}",
                        product.getProductid(),
                        newEndTime);
            } else {
                log.debug("Product {} has no recent bids, not extending",
                        product.getProductid());
            }
        } catch (Exception e) {
            log.error("Error checking auto-extend for product {}: {}",
                    product.getProductid(), e.getMessage(), e);
        }
    }
}
