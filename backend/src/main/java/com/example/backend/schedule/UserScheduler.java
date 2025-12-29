package com.example.backend.schedule;

import com.example.backend.entity.ConfigVariable;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductStatus;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ConfigurationService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserScheduler {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final ConfigurationService configurationService;

    @Scheduled(cron = "0 0 * * * *") // Chạy vào phút thứ 0 của mỗi giờ (mỗi tiếng check 1 lần)
    public void checkAndRevokeSellerRole() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Bắt đầu quét các Seller hết hạn lúc: {}", now);

        int count = userRepository.revokeExpiredSellers(now);

        if (count > 0) {
            log.info("Đã thu hồi quyền của {} seller hết hạn.", count);
        } else {
            log.info("Không có seller nào hết hạn trong đợt quét này.");
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void checkAndRevokeproduct() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Bắt đầu quét các sản phẩm hết hạn lúc: {}", now);

        // Tìm các sản phẩm ACTIVE đã hết hạn
        List<Product> expiredProducts = productRepository
                .findByTrangThaiAndThoiGianKetThucBefore(ProductStatus.ACTIVE, now);

        if (expiredProducts.isEmpty()) {
            log.debug("Không có sản phẩm nào hết hạn");
            return;
        }

        log.info("Tìm thấy {} sản phẩm hết hạn", expiredProducts.size());

        for (Product product : expiredProducts) {
            productService.processExpiredProduct(product);
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void checkAutoExtend() {
        log.debug("Checking products for auto-extend...");
        int checkWindowMinutes = configurationService.getConfigurationVariable(ConfigVariable.CHECK_PRODUCT_MINUTES).getValue();
        int extensionMinutes =  configurationService.getConfigurationVariable(ConfigVariable.EXTENSION_MINUTES).getValue();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime checkUntil = now.plusMinutes(checkWindowMinutes);

        // Tìm sản phẩm ACTIVE, có auto-extend, sắp hết hạn
        List<Product> products = productRepository
                .findByTrangThaiAndChoPhepTuDongGiaHanAndThoiGianKetThucBetween(
                        ProductStatus.ACTIVE, true, now, checkUntil
                );

        if (products.isEmpty()) {
            log.debug("No products need auto-extend check");
            return;
        }

        log.info("Checking {} products for auto-extend", products.size());

        for (Product product : products) {
            productService.checkAndExtendProduct(product, checkWindowMinutes, extensionMinutes);
        }
    }
}
