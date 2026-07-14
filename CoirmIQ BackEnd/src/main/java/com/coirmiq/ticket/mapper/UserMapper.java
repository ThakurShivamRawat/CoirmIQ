package com.coirmiq.ticket.mapper;

import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.dto.UserDTO;
import com.coirmiq.ticket.dto.UserRegisterRequest;
import com.coirmiq.ticket.dto.HostProfileDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDto(User user);

    HostProfileDTO toHostProfileDto(User user);

    @Mapping(target = "id", ignore = true)
    User toEntity(UserRegisterRequest request);
}
