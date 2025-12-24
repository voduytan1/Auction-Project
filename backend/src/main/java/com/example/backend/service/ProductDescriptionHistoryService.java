package com.example.backend.service;

import com.example.backend.dto.product.descriptionhistory.AppendDescriptionRequest;
import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductDescriptionHistory;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.ProductDescriptionHistoryMapper;
import com.example.backend.repository.ProductDescriptionHistoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.base.BaseService;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductDescriptionHistoryService extends BaseService<ProductDescriptionHistory, Long, AppendDescriptionRequest, Void, DescriptionHistoryResponse> {
    private final ProductDescriptionHistoryRepository productDescriptionHistoryRepository;
    private final ProductDescriptionHistoryMapper productDescriptionHistoryMapper;
    private final ProductRepository productRepository;

    public ProductDescriptionHistoryService(ProductDescriptionHistoryRepository productDescriptionHistoryRepository, ProductDescriptionHistoryMapper productDescriptionHistoryMapper, ProductRepository productRepository) {
        this.productDescriptionHistoryRepository = productDescriptionHistoryRepository;
        this.productDescriptionHistoryMapper = productDescriptionHistoryMapper;
        this.productRepository = productRepository;
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
