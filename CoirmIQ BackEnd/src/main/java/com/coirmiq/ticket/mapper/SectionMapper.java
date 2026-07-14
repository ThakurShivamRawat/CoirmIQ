package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Section;
import com.coirmiq.ticket.dto.SectionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {RowMapper.class})
public interface SectionMapper {
    SectionDTO toDto(Section section);
}
