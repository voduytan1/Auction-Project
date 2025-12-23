package com.example.backend.mapper;

import com.example.backend.dto.admin.UpgradeRequest.UpgradeRequestResponse;
import com.example.backend.entity.UpgradeRequest;
import jakarta.validation.constraints.NotNull;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UpgradeRequestMapper {

    @Mapping(target = "userid", source = "user.userid")
    @Mapping(target = "approvedByAdmin", source = "approvedByAdmin.userid")
    @Mapping(target = "username", source = "user.username")
    UpgradeRequestResponse toResponse(@NotNull UpgradeRequest upgradeRequest);
}
