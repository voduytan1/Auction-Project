package com.example.backend.mapper;

import com.example.backend.dto.bid.BidHistoryResponse;
import com.example.backend.entity.BidHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named; // Import cái này

@Mapper(componentModel = "spring")
public interface BidHistoryMapper {

    // 1. Dùng qualifiedByName để gọi hàm mask
    @Mapping(target = "tenBidder", source = "bidHistory.bidder.hoVaTen", qualifiedByName = "maskName")
    @Mapping(target = "bidderId", ignore = true)
    @Mapping(target = "thoiGianDat", source = "createdAt")
    BidHistoryResponse toResponse(BidHistory bidHistory);

    // 2. Hàm này sẽ KHÔNG bị dính mask nữa vì hàm mask kia đã bị "cô lập" bởi @Named
    @Mapping(target = "tenBidder", source = "bidHistory.bidder.hoVaTen")
    @Mapping(target = "bidderId", source = "bidHistory.bidder.userid")
    @Mapping(target = "thoiGianDat", source = "createdAt")
    BidHistoryResponse toResponseNoMask(BidHistory bidHistory);

    // 3. Thêm @Named vào đây
    @Named("maskName")
    default String maskBidderName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "****";
        }
        String[] parts = fullName.trim().split("\\s+");
        String lastName = parts[parts.length - 1];
        return "****" + lastName;
    }
}