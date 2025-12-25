package com.example.backend.mapper;

import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductDescriptionHistory;
import com.example.backend.entity.ProductImage;
import com.example.backend.utils.MyStringUtils;
import org.mapstruct.*;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring")
public abstract class ProductMapper {
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
    public abstract Product toEntity(CreateProductRequest request);

    @Mapping(target = "images",source = "product.images", qualifiedByName = "mapImages")
    @Mapping(target = "categoryId", source = "product.category.categoryid")
    @Mapping(target = "tenDanhMuc", source = "product.category.tenDanhMuc")
    @Mapping(target = "parentCategoryId", source = "product.category.parentCategory.categoryid")
    @Mapping(target = "tenDanhMucCha", source = "product.category.parentCategory.tenDanhMuc")
    @Mapping(target = "tenSeller", source = "product.seller.hoVaTen")
    @Mapping(target = "diemDanhGiaSeller", source = "product.seller.diemDanhGia")
    @Mapping(target = "anhDaiDienSeller", source = "product.seller.anhDaiDien")
    @Mapping(target = "tenBidder", source = "product.currentBidder.hoVaTen", qualifiedByName = "maskBidderName")
    @Mapping(target = "diemDanhGiaBidder", source = "product.currentBidder.diemDanhGia")
    public abstract ProductResponse toResponse(Product product);

    @Named("maskBidderName")
    protected String maskBidderName(String fullName) {
        if(fullName == null || fullName.trim().isBlank()){
            return null;
        }
        return MyStringUtils.maskBidderName(fullName);
    }

    @Named("mapImages")
    protected List<String> mapImages(List<ProductImage> images) {
        if (images == null) {
            return Collections.emptyList();
        }
        return images.stream()
                .map(ProductImage::getUrlAnh) // Get the 'urlAnh' field
                .collect(Collectors.toList());
    }
    @AfterMapping
    protected void enrichDescription(Product product, @MappingTarget ProductResponse response) {
        List<ProductDescriptionHistory> histories = product.getProductDescriptionHistories();

        if (histories == null || histories.isEmpty()) {
            return;
        }

        //sort theo thời gian tăng dần (cũ -> mới)
        histories.sort(Comparator.comparing(ProductDescriptionHistory::getThoiGianThem));

        StringBuilder fullDescription = new StringBuilder();

        // 1. Thêm mô tả gốc
        if (response.getMoTa() != null) {
            fullDescription.append(response.getMoTa());
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // 2. Duyệt qua lịch sử và append vào chuỗi
        for (ProductDescriptionHistory history : histories) {
            fullDescription.append("<br><br>");
            fullDescription.append("<b>--- Cập nhật ngày: ")
                    .append(history.getThoiGianThem().format(formatter))
                    .append(" ---</b><br>");
            fullDescription.append(history.getNoiDungThem());
        }

        // 3. Gán lại vào response
        response.setMoTa(fullDescription.toString());
    }
}
