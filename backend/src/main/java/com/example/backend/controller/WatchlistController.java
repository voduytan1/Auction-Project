package com.example.backend.controller;

import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.watchlist.CreateWatchlistRequest;
import com.example.backend.dto.watchlist.WatchlistResponse;
import com.example.backend.entity.WatchList;
import com.example.backend.repository.WatchlistRepository;
import com.example.backend.service.WatchlistService;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/theo-doi")
public class WatchlistController {
    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<@NotNull ApiResponse<List<Long>>> findOwn(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }

        List<WatchList> watchLists = watchlistService.getOwn(UUID.fromString(sub));
        List<Long> result = watchLists.stream().map(wl -> wl.getProduct().getProductid()).toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public ResponseEntity<@NotNull ApiResponse<WatchlistResponse>> create(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid CreateWatchlistRequest createWatchlistRequest) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }

        WatchList watchList = watchlistService.createOne(createWatchlistRequest.getProductId(), UUID.fromString(sub));

        return ResponseEntity.ok(ApiResponse.success(WatchlistResponse.builder()
                .watchlistId(watchList.getWatchlistid())
                .productId(watchList.getProduct().getProductid())
                .tenSanPham(watchList.getProduct().getTenSanPham())
                .userId(UUID.fromString(sub))
                .build()));
    }

    @DeleteMapping
    public ResponseEntity<@NotNull Void> delete(@AuthenticationPrincipal Jwt jwt, @RequestBody @Valid CreateWatchlistRequest createWatchlistRequest) {
        String sub = jwt != null ? jwt.getSubject() : null;
        if (sub == null) {
            throw new BadCredentialsException("Lỗi access token không hợp lệ");
        }

        watchlistService.deleteOne(UUID.fromString(sub), createWatchlistRequest.getProductId());
        return ResponseEntity.noContent().build();
    }
}
