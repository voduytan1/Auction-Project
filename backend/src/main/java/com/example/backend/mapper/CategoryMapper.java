package com.example.backend.mapper;
import com.example.backend.dto.category.CategoryResponse;
import com.example.backend.dto.category.CreateCategoryRequest;
import com.example.backend.dto.category.UpdateCategoryRequest;
import com.example.backend.dto.user.UpdateUserRequest;
import com.example.backend.entity.Category;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "level", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toEntity(CreateCategoryRequest createCategoryRequest);

    @Mapping(source = "parentCategory.categoryid", target = "parentCategoryId")
    @Mapping(source = "parentCategory.tenDanhMuc", target = "parentCategoryName")
    CategoryResponse toResponse(Category category);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "categoryid", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)  //handle in  Service
    @Mapping(target = "level", ignore = true) //hanle in service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(UpdateCategoryRequest dto, @MappingTarget Category category);
}
