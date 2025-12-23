package com.example.backend.mapper;

import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "productid", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "trangThai", ignore = true)
    @Mapping(target = "thoiGianKetThuc", ignore = true)
    @Mapping(target = "soLuotRaGia", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "currentBidder", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "giaHienTai", ignore = true)
    Product toEntity(CreateProductRequest request);

    @Mapping(target = "images", ignore = true)
    ProductResponse toResponse(Product product);
}
