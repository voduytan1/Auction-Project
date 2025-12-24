package com.example.backend.mapper;

import com.example.backend.dto.product.CreateProductRequest;
import com.example.backend.dto.product.ProductResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductDescriptionHistory;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;


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

    @Mapping(target = "images", ignore = true)
    public abstract ProductResponse toResponse(Product product);

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
