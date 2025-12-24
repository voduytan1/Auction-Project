package com.example.backend.mapper;

import com.example.backend.dto.blockedbidder.BlockedBidderResponse;
import com.example.backend.dto.blockedbidder.CreateBlockedBidderRequest;
import com.example.backend.entity.BlockedBidder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BlockedBidderMapper {
    @Mapping(source = "product.productid", target = "productid")
    @Mapping(source = "product.tenSanPham", target = "tenSanPham")
    @Mapping(source = "bidder.userid", target = "bidderid")
    @Mapping(source = "bidder.hoVaTen", target = "tenBidder")
    @Mapping(source = "bidder.email", target = "emailBidder")
    @Mapping(source = "seller.userid", target = "sellerid")
    @Mapping(source = "seller.hoVaTen", target = "tenSeller")
    BlockedBidderResponse toResponse(BlockedBidder blockedBidder);

    // Convert request to entity (partial mapping)
    @Mapping(target = "blockid", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "bidder", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    BlockedBidder toEntity(CreateBlockedBidderRequest request);
}
