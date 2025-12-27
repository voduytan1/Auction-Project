package com.example.backend.mapper;

import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "transactionId",source = "transactionid")
    @Mapping(target = "productId",source = "transaction.product.productid")
    @Mapping(target = "anhDaiDienSanPham",source = "transaction.product.images", qualifiedByName = "getFirstImageUrl")
    @Mapping(target = "tenSanPham",source = "transaction.product.tenSanPham")
    @Mapping(target = "buyerId",source = "transaction.buyer.userid")
    @Mapping(target = "tenNguoiMua",source = "transaction.buyer.hoVaTen")
    @Mapping(target = "sellerId",source = "transaction.seller.userid")
    @Mapping(target = "tenNguoiBan",source = "transaction.seller.hoVaTen")
    @Mapping(target = "gia",source = "giaCuoiCung")
    TransactionResponse toResponse(Transaction transaction);

    @Named("getFirstImageUrl")
    default String getFirstImageUrl(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return null; // Hoặc trả về URL ảnh mặc định nếu cần
        }

        // Cách 1: Lấy phần tử đầu tiên trong list (Nhanh nhất nếu list đã sort sẵn)
        // return images.get(0).getUrlAnh();

        // Cách 2: (Khuyên dùng) Sort theo 'thuTu' để đảm bảo lấy đúng ảnh bìa
        return images.stream()
                .min(Comparator.comparing(ProductImage::getThuTu, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(ProductImage::getUrlAnh)
                .orElse(null); // hoặc images.get(0).getUrlAnh() nếu muốn fallback
    }
}
