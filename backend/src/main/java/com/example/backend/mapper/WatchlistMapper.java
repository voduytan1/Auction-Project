package com.example.backend.mapper;

import com.example.backend.dto.watchlist.WatchlistResponse;
import com.example.backend.entity.WatchList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface WatchlistMapper {
    
    @Mapping(source = "watchlistid", target = "watchlistId")
    @Mapping(source = "user.userid", target = "userId")
    @Mapping(source = "product", target = "product")
    WatchlistResponse toResponse(WatchList watchList);
}
