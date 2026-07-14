package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.Venue;
import com.coirmiq.ticket.dto.VenueDTO;
import com.coirmiq.ticket.dto.VenueSummaryDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {SectionMapper.class, UserMapper.class})
public interface VenueMapper {
    VenueDTO toDto(Venue venue);
    VenueSummaryDTO toSummaryDto(Venue venue);
}
