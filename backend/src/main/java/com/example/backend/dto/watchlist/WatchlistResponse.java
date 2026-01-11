package com.example.backend.dto.watchlist;

import com.example.backend.dto.product.ProductResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistResponse {
    Long watchlistId;
    UUID userId;
    ProductResponse product;
}
