package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.EventInventory;
import com.coirmiq.ticket.dto.EventInventoryDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {EventMapper.class, RowMapper.class})
public interface EventInventoryMapper {
    EventInventoryDTO toDto(EventInventory inventory);
}
