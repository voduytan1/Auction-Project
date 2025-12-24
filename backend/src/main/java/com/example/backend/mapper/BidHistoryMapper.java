package com.example.backend.mapper;

import com.example.backend.dto.bid.BidHistoryResponse;
import com.example.backend.entity.BidHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BidHistoryMapper {
    @Mapping(target = "tenBidder", expression = "java(maskBidderName(bidHistory.getBidder().getHoVaTen()))")
    BidHistoryResponse toResponse(BidHistory bidHistory);

    // Mask bidder name: "Nguyễn Văn Khoa" -> "****Khoa"
    default String maskBidderName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "****";
        }
        String[] parts = fullName.trim().split("\\s+");
        String lastName = parts[parts.length - 1];
        return "****" + lastName;
    }
}
