package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Ticket;
import com.coirmiq.ticket.dto.TicketDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EventInventoryMapper.class})
public interface TicketMapper {

    @Mapping(source = "booking.id", target = "bookingId")
    TicketDTO toDto(Ticket ticket);
}
