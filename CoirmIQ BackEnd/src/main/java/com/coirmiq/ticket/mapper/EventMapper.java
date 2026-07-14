package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Event;
import com.coirmiq.ticket.dto.EventDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {VenueMapper.class, CategoryMapper.class, UserMapper.class})
public interface EventMapper {
    EventDTO toDto(Event event);
}
