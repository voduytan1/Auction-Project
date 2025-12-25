package com.example.backend.mapper;

import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "transactionId",source = "transactionid")
    @Mapping(target = "productId",source = "transaction.product.productid")
    @Mapping(target = "tenSanPham",source = "transaction.product.tenSanPham")
    @Mapping(target = "buyerId",source = "transaction.buyer.userid")
    @Mapping(target = "tenNguoiMua",source = "transaction.buyer.hoVaTen")
    @Mapping(target = "sellerId",source = "transaction.seller.userid")
    @Mapping(target = "tenNguoiBan",source = "transaction.seller.hoVaTen")
    @Mapping(target = "gia",source = "giaCuoiCung")
    TransactionResponse toResponse(Transaction transaction);
}
