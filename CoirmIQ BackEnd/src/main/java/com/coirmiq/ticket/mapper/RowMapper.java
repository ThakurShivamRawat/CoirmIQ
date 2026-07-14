package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Row;
import com.coirmiq.ticket.dto.RowDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RowMapper {
    RowDTO toDto(Row row);
}
