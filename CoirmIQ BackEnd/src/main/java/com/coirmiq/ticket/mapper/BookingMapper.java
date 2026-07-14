package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Booking;
import com.coirmiq.ticket.dto.BookingDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TicketMapper.class})
public interface BookingMapper {
    BookingDTO toDto(Booking booking);
}
