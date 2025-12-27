package com.example.backend.dto.watchlist;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateWatchlistRequest {
    @NotNull(message = "Vui lòng cung cấp id sản phẩm")
    Long productId;
}
