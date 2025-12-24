package com.example.backend.mapper;

import com.example.backend.dto.rating.CreateRatingRequest;
import com.example.backend.dto.rating.RatingResponse;
import com.example.backend.entity.Rating;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RatingMapper {
    @Mapping(source = "rater.userid", target = "raterid")
    @Mapping(source = "rater.hoVaTen", target = "tenRater")
    @Mapping(source = "ratee.userid", target = "rateeid")
    @Mapping(source = "ratee.hoVaTen", target = "tenRatee")
    @Mapping(source = "product.productid", target = "productid")
    @Mapping(source = "product.tenSanPham", target = "tenSanPham")
    RatingResponse toResponse(Rating rating);

    @Mapping(target = "ratingid", ignore = true)
    @Mapping(target = "rater", ignore = true)
    @Mapping(target = "ratee", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Rating toEntity(CreateRatingRequest request);
}
