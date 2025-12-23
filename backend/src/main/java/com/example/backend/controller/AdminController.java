package com.example.backend.controller;

import com.example.backend.dto.admin.UpgradeRequest.UpgradeRequestResponse;
import com.example.backend.dto.admin.config.CreateConfigRequest;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.entity.ConfigVariable;
import com.example.backend.entity.Configuration;
import com.example.backend.service.ConfigurationService;
import com.example.backend.service.UpgradeRequestService;
import com.example.backend.utils.PageUtils;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UpgradeRequestService  upgradeRequestService;
    private final ConfigurationService configurationService;

    public AdminController(UpgradeRequestService upgradeRequestService, ConfigurationService configurationService) {
        this.upgradeRequestService = upgradeRequestService;
        this.configurationService = configurationService;
    }
    // Request
    @GetMapping("/request")
    public ResponseEntity<@NotNull ApiResponse<List<UpgradeRequestResponse>>> getAllRequest(@Valid @ModelAttribute PaginationRequest request){
        Pageable pageable = request.getPageable();
        String search = request.getSearch();
        Page<@NotNull UpgradeRequestResponse> result;
        PaginationInfo paginationInfo;
        if(search == null){
            result = upgradeRequestService.findAll(pageable);
            paginationInfo = PageUtils.fromPage(result, null);
        }else{
            result = upgradeRequestService.findByUsername(search, pageable);
            paginationInfo = PageUtils.fromPage(result, search);
        }
        return ResponseEntity.ok(ApiResponse.successWithPagination("Lấy danh sách danh mục thành công", result.getContent(), paginationInfo));
    }

    @GetMapping("/request/pending")
    public ResponseEntity<@NotNull ApiResponse<List<UpgradeRequestResponse>>> getAllPendingRequest(@Valid @ModelAttribute PaginationRequest request){
        Pageable pageable = request.getPageable();
        String search = request.getSearch();
        Page<@NotNull UpgradeRequestResponse> result;
        PaginationInfo paginationInfo;
        if(search == null){
            result = upgradeRequestService.findAllPending(pageable);
            paginationInfo = PageUtils.fromPage(result, null);
        }else{
            result = upgradeRequestService.findByUsernameAndPending(search, pageable);
            paginationInfo = PageUtils.fromPage(result, search);
        }
        return ResponseEntity.ok(ApiResponse.successWithPagination("Lấy danh sách danh mục thành công", result.getContent(), paginationInfo));
    }

    @PostMapping("/requests/{id}")
    public ResponseEntity<@NotNull Void> approveRequest(@PathVariable @NotNull Long id, @RequestBody Map<String, Boolean> body){
        upgradeRequestService.approveUpgradeRequest(id, body.get("approve"));
        return  ResponseEntity.ok().build();
    }

    //Configuration
    @GetMapping("/config/{variable}")
    public ResponseEntity<@NotNull ApiResponse<Configuration>> getAllConfiguration(@PathVariable @NotNull ConfigVariable variable){
        Configuration config = configurationService.getConfigurationVariable(variable);
        return  ResponseEntity.ok(ApiResponse.success(config));
    }
    @PostMapping("/config")
    public ResponseEntity<@NotNull ApiResponse<Configuration>> CreateConfig(@RequestBody @Valid CreateConfigRequest request){
        Configuration config = configurationService.setConfigurationVariable(request);
        return ResponseEntity.ok(ApiResponse.success(config));
    }
}

