package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Category;
import com.coirmiq.ticket.dto.CategoryDTO;
import com.coirmiq.ticket.dto.CategoryRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDTO toDto(Category category);

    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryRequest request);
}
