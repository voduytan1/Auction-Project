package com.example.backend.mapper;

import com.example.backend.dto.bid.AutoBidResponse;
import com.example.backend.dto.bid.PlaceAutoBidRequest;
import com.example.backend.entity.AutoBid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AutoBidMapper {
    @Mapping(source = "product.productid", target = "productid")
    @Mapping(source = "product.tenSanPham", target = "tenSanPham")
    @Mapping(source = "product.giaHienTai", target = "giaHienTai")
    @Mapping(source = "bidder.userid", target = "bidderid")
    @Mapping(source = "bidder.hoVaTen", target = "tenBidder")
    @Mapping(target = "isWinning", expression = "java(isWinning(autoBid))")
    AutoBidResponse toResponse(AutoBid autoBid);

    // Custom method to check if bidder is winning
    default Boolean isWinning(AutoBid autoBid) {
        if (autoBid.getProduct().getCurrentBidder() == null) {
            return false;
        }
        return autoBid.getProduct().getCurrentBidder().getUserid()
                .equals(autoBid.getBidder().getUserid());
    }

    @Mapping(target = "autobidid", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "bidder", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AutoBid toEntity(PlaceAutoBidRequest request);
}
