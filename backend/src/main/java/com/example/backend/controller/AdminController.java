package com.example.backend.controller;

import com.example.backend.dto.admin.UpgradeRequest.UpgradeRequestResponse;
import com.example.backend.dto.admin.config.CreateConfigRequest;
import com.example.backend.dto.admin.dashboard.*;
import com.example.backend.dto.common.ApiResponse;
import com.example.backend.dto.common.PaginationInfo;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.entity.ConfigVariable;
import com.example.backend.entity.Configuration;
import com.example.backend.service.*;
import com.example.backend.utils.DateUtils;
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
    private final TransactionService transactionService;
    private final UserService userService;
    private final ProductService productService;

    public AdminController(UpgradeRequestService upgradeRequestService, ConfigurationService configurationService, TransactionService transactionService, UserService userService, ProductService productService) {
        this.upgradeRequestService = upgradeRequestService;
        this.configurationService = configurationService;
        this.transactionService = transactionService;
        this.userService = userService;
        this.productService = productService;
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

    //Dashboard
    @GetMapping("/dashboard/upgrade-request/today")
    public ResponseEntity<@NotNull ApiResponse<UpgradeRequestChartResponse>> getTodayUpgradeRequestChart(){
        UpgradeRequestChartResponse response = upgradeRequestService.getUpgradeRequestChart(DateUtils.getStartOfToday(), DateUtils.getEndOfToday());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/upgrade-request/this-week")
    public ResponseEntity<@NotNull ApiResponse<UpgradeRequestChartResponse>> getWeaklyUpgradeRequestChart(){
        UpgradeRequestChartResponse response = upgradeRequestService.getUpgradeRequestChart(DateUtils.getStartOfWeek(), DateUtils.getEndOfWeek());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/upgrade-request/this-month")
    public ResponseEntity<@NotNull ApiResponse<UpgradeRequestChartResponse>> getMonthlyUpgradeRequestChart(){
        UpgradeRequestChartResponse response = upgradeRequestService.getUpgradeRequestChart(DateUtils.getStartOfMonth(), DateUtils.getEndOfMonth());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/revenue/this-year")
    public ResponseEntity<@NotNull ApiResponse<List<RevenueDataPoint>>> getMonthlyRevenueChart(){
        List<RevenueDataPoint> response = transactionService.getMonthlyRevenueChart();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/new-user/this-year")
    public ResponseEntity<@NotNull ApiResponse<List<NewUserDataPoint>>> getMonthlyUserChart(){
        List<NewUserDataPoint> response = userService.getNewUserChart();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/product/this-year")
    public ResponseEntity<@NotNull ApiResponse<List<ProductDataPoint>>> getMonthlyProductChart(){
        List<ProductDataPoint> response = productService.getNewProductChart();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/dashboard/categories")
    public ResponseEntity<@NotNull ApiResponse<List<CategoryDistribution>>> getCategoriesChart(){
        List<CategoryDistribution> response = productService.getProductByCategoriesChart();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

