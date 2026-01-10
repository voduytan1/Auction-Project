package com.example.backend.service;

import com.example.backend.dto.product.descriptionhistory.AppendDescriptionRequest;
import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductDescriptionHistory;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.ProductDescriptionHistoryMapper;
import com.example.backend.repository.ProductDescriptionHistoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.BidHistoryRepository;
import com.example.backend.service.base.BaseService;
import com.example.backend.service.EmailService;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ProductDescriptionHistoryService extends BaseService<ProductDescriptionHistory, Long, AppendDescriptionRequest, Void, DescriptionHistoryResponse> {
    private final ProductDescriptionHistoryRepository productDescriptionHistoryRepository;
    private final ProductDescriptionHistoryMapper productDescriptionHistoryMapper;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final BidHistoryRepository bidHistoryRepository;

    public ProductDescriptionHistoryService(ProductDescriptionHistoryRepository productDescriptionHistoryRepository, ProductDescriptionHistoryMapper productDescriptionHistoryMapper, ProductRepository productRepository, EmailService emailService, BidHistoryRepository bidHistoryRepository) {
        this.productDescriptionHistoryRepository = productDescriptionHistoryRepository;
        this.productDescriptionHistoryMapper = productDescriptionHistoryMapper;
        this.productRepository = productRepository;
        this.emailService = emailService;
        this.bidHistoryRepository = bidHistoryRepository;
    }

    @Override
    protected JpaRepository<@NotNull ProductDescriptionHistory, @NotNull Long> getRepository() {
        return productDescriptionHistoryRepository;
    }

    @Override
    protected void validateForCreation(AppendDescriptionRequest dto) {

    }

    @Override
    protected ProductDescriptionHistory mapToEntity(AppendDescriptionRequest dto) {
        return productDescriptionHistoryMapper.toEntity(dto);
    }

    @Override
    protected DescriptionHistoryResponse mapToResponse(ProductDescriptionHistory entity) {
        return productDescriptionHistoryMapper.toResponse(entity);
    }

    @Override
    protected void updateEntityFromDto(Void dto, ProductDescriptionHistory entity) {

    }

    @Override
    protected void beforeSave(ProductDescriptionHistory entity, AppendDescriptionRequest dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(()->new EntityNotFoundException("Không tìm thầy sản phẩm với id "+ dto.getProductId()));
        entity.setProduct(product);
    }

    @Override
    protected void beforeUpdate(ProductDescriptionHistory entity, Void dto) {

    }

    @Override
    protected void beforeDelete(Long aLong) {

    }

    @Override
    protected void evictCaches() {

    }

    public DescriptionHistoryResponse createOne(AppendDescriptionRequest request, UUID userid){
        validateForCreation(request);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(()->new EntityNotFoundException("Không tìm thấy sản phẩm với id "+ request.getProductId()));
        if(!userid.equals(product.getSeller().getUserid())){
            throw new ForbiddenException("Bạn không thể chỉnh sửa mô tả sản phẩm của người khác");
        }

        // Step 2: Map to entity
        ProductDescriptionHistory entity = mapToEntity(request);

        // Step 3: Business logic before save
        beforeSave(entity, request);

        // Step 4: Save and return response
        ProductDescriptionHistory savedEntity = getRepository().save(entity);

        try {
            Set<String> recipientSet = bidHistoryRepository.findByProductProductid(product.getProductid())
                    .stream()
                    .map(bid -> bid.getBidder().getEmail())
                    .collect(Collectors.toSet());

            if (!recipientSet.isEmpty()) {
                // QUAN TRỌNG: Lấy toàn bộ danh sách lịch sử từ DB ra (bao gồm cái vừa save)
                // Phải gọi repository tìm lại để đảm bảo lấy đủ và đúng thứ tự
                List<ProductDescriptionHistory> fullHistory = productDescriptionHistoryRepository
                        .findByProductProductidOrderByThoiGianThemAsc(product.getProductid());

                emailService.sendDescriptionUpdateNotification(
                    recipientSet.toArray(new String[0]),
                    product.getTenSanPham(),
                    product.getMoTa(),  // Mô tả gốc
                    fullHistory,        // Truyền cả List lịch sử
                    product.getProductid()
                );
            }
        } catch (Exception e) {
            log.error("Lỗi gửi mail: {}", e.getMessage());
        }

        evictCaches();
        return mapToResponse(savedEntity);
    }

    public List<DescriptionHistoryResponse> getByProduct(Long productId) {
        List<ProductDescriptionHistory> result =  productDescriptionHistoryRepository.findByProduct_Productid(productId);
        return result.stream()
                .map(productDescriptionHistoryMapper::toResponse)
                .toList();
    }

    
}
