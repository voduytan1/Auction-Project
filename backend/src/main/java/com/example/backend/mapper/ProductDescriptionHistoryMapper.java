package com.example.backend.mapper;

import com.example.backend.dto.product.descriptionhistory.AppendDescriptionRequest;
import com.example.backend.dto.product.descriptionhistory.DescriptionHistoryResponse;
import com.example.backend.entity.ProductDescriptionHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "Spring")
public interface ProductDescriptionHistoryMapper {

    @Mapping(target = "descHistoryid", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "thoiGianThem", ignore = true)
    ProductDescriptionHistory toEntity(AppendDescriptionRequest appendDescriptionRequest);

    @Mapping(target = "id", source = "descHistoryid")
    @Mapping(target = "productId", source = "product.productid")
    DescriptionHistoryResponse toResponse(ProductDescriptionHistory productDescriptionHistory);
}
