package com.example.backend.mapper;

import com.example.backend.dto.product.question.AnswerProductQuestionRequest;
import com.example.backend.dto.product.question.CreateProductQuestionRequest;
import com.example.backend.dto.product.question.ProductQuestionResponse;
import com.example.backend.entity.ProductQuestion;
import org.mapstruct.*;

@Mapper(componentModel = "spring")

public interface ProductQuestionMapper {
    @Mapping(target = "questionid", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "asker", ignore = true)
    @Mapping(target = "thoiGianHoi", ignore = true)
    @Mapping(target = "thoiGianTraLoi", ignore = true)
    ProductQuestion toEntity(CreateProductQuestionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(AnswerProductQuestionRequest dto,  @MappingTarget ProductQuestion entity);

    @Mapping(target = "productId", source = "productQuestion.product.productid")
    @Mapping(target = "askerId", source = "productQuestion.asker.userid")
    @Mapping(target = "tenNguoiHoi", source = "productQuestion.asker.hoVaTen")
    @Mapping(target = "anhDaiDienNguoiHoi", source = "productQuestion.asker.anhDaiDien")
    @Mapping(target = "diemDanhGiaNguoiHoi", source = "productQuestion.asker.diemDanhGia")
    ProductQuestionResponse toResponse(ProductQuestion productQuestion);

}
