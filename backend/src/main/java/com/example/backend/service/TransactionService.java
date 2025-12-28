package com.example.backend.service;

import com.example.backend.dto.admin.dashboard.RevenueDataPoint;
import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.rating.CreateRatingRequest;
import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.entity.Transaction;
import com.example.backend.entity.TransactionStatus;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.TransactionMapper;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.utils.DateUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final RatingService ratingService;
    private final WebSocketEventPublisher webSocketEventPublisher;

    public TransactionService(TransactionRepository transactionRepository, TransactionMapper transactionMapper, RatingService ratingService, WebSocketEventPublisher webSocketEventPublisher) {
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
        this.ratingService = ratingService;
        this.webSocketEventPublisher = webSocketEventPublisher;
    }

    public Transaction getOne(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public TransactionResponse findOne(Long id, UUID userid){
        Transaction transaction = transactionRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Không tìm thấy giao dịch với id "+ id));
        if(!userid.equals(transaction.getBuyer().getUserid())&&!userid.equals(transaction.getSeller().getUserid())){
            throw new ForbiddenException("Không có quyền truy cập giao dịch này");
        }
        return transactionMapper.toResponse(transaction);
    }

    public Page<@NotNull TransactionResponse> findOwnBuyerTransactions(Pageable pageable, UUID userid) {
        Page<@NotNull Transaction> transactions = transactionRepository.findAllByBuyer_Userid(userid, pageable);
        List<TransactionResponse> list = transactions.getContent().stream()
                .map(transactionMapper::toResponse)
                .toList();
        return new PageImpl<>(list, pageable, transactions.getTotalElements());
    }

    public Page<@NotNull TransactionResponse> findOwnSellerTransactions(Pageable pageable, UUID userid) {
        Page<@NotNull Transaction> transactions = transactionRepository.findAllBySeller_Userid(userid, pageable);
        List<TransactionResponse> list = transactions.getContent().stream()
                .map(transactionMapper::toResponse)
                .toList();
        return new PageImpl<>(list, pageable, transactions.getTotalElements());
    }

    @Transactional
    public Void completePayment(Long transactionId){
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy giao dịch với id " + transactionId));
        if(!transaction.getTrangThai().equals(TransactionStatus.PENDING_PAYMENT)){
            throw new IllegalStateException("Giao dịch phải ở trạng thái chờ thanh toán để thanh toán");
        }
        transaction.setTrangThai(TransactionStatus.PAYMENT_COMPLETED);
        transaction.setThoiGianThanhToan(LocalDateTime.now());
        Transaction saved = transactionRepository.save(transaction);
        webSocketEventPublisher.publishTransactionStatusChange(transactionMapper.toResponse(saved), "Người mua thanh toán thành công");
        return null;
    }

    @Transactional
    public TransactionResponse addAddress(Long transactionId, String address, UUID userid) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giao dịch với id " + transactionId));
        if (!userid.equals(transaction.getBuyer().getUserid())){
            throw new ForbiddenException("Bạn không phải người thắng đấu giá của sản phẩm này");
        }

            if(!transaction.getTrangThai().equals(TransactionStatus.PAYMENT_COMPLETED)){
            throw new IllegalStateException("Giao dịch phải ở trạng thái đã thanh toán để có thể thêm địa chỉ giao hàng");
        }


        transaction.setDiaChiGiaoHang(address);
        transaction.setTrangThai(TransactionStatus.AWAITING_SHIPMENT);

        TransactionResponse response = transactionMapper.toResponse(transactionRepository.save(transaction));
        webSocketEventPublisher.publishTransactionStatusChange(response, "Người mua đã điền địa chỉ");
        return response;
    }

    @Transactional
    public TransactionResponse addShipmentProve(Long transactionId, String maVanDon, UUID userid) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy giao dịch với id " + transactionId));

        if (!userid.equals(transaction.getSeller().getUserid())){
            throw new ForbiddenException("Bạn không phải người bán đấu giá của sản phẩm này");
        }

        if(!transaction.getTrangThai().equals(TransactionStatus.AWAITING_SHIPMENT)){
            throw new IllegalStateException("Giao dịch phải ở trạng thái chờ gửi hàng mới có thể nhập mã vận đơn");
        }

        transaction.setMaVanDon(maVanDon);
        transaction.setThoiGianGiaoHang(LocalDateTime.now());
        transaction.setTrangThai(TransactionStatus.SHIPPED);

        TransactionResponse response = transactionMapper.toResponse(transactionRepository.save(transaction));
        webSocketEventPublisher.publishTransactionStatusChange(response, "Người bán đã gửi mã vận đơn");
        return response;
    }

    @Transactional
    public TransactionResponse completeTransaction(Long transactionId, UUID userid) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy giao dịch với id " + transactionId));

        if (!userid.equals(transaction.getBuyer().getUserid())){
            throw new ForbiddenException("Bạn không phải người thắng đấu giá của sản phẩm này");
        }

        if(!transaction.getTrangThai().equals(TransactionStatus.SHIPPED)){
            throw new IllegalStateException("Giao dịch phải chưa ở trạng thái đã gửi hàng");
        }

        transaction.setTrangThai(TransactionStatus.COMPLETED);
        transaction.setThoiGianNhanHang(LocalDateTime.now());
        TransactionResponse response = transactionMapper.toResponse(transactionRepository.save(transaction));
        webSocketEventPublisher.publishTransactionStatusChange(response, "Người mua đã xác nhận nhận hàng");
        return response;
    }

    @Transactional
    public TransactionResponse cancelTransaction(Long transactionId, UUID userid) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy giao dịch với id " + transactionId));

        if (!userid.equals(transaction.getSeller().getUserid())){
            throw new ForbiddenException("Bạn không phải người bán đấu giá của sản phẩm này");
        }

        if(!transaction.getTrangThai().equals(TransactionStatus.PENDING_PAYMENT)){
            throw new IllegalStateException("Không thể hủy giao dịch vì người thắng đấu giá đã thanh toán");
        }

        transaction.setTrangThai(TransactionStatus.CANCELLED);
        TransactionResponse response = transactionMapper.toResponse(transactionRepository.save(transaction));

        String nhanXet = "Người thắng không thanh toán";
        CreateRatingRequest createRatingRequest = CreateRatingRequest.builder()
                .transactionId(transactionId)
                .rateeId(transaction.getBuyer().getUserid())
                .diem(-1)
                .nhanXet(nhanXet)
                .build();

        ratingService.createOne(createRatingRequest, userid);

        webSocketEventPublisher.publishTransactionStatusChange(response, "Người bán đã gửi hủy giao dịch");
        return response;
    }

//    public List<RevenueDataPoint> getRevenueChart(LocalDateTime start, LocalDateTime end) {
//        List<RevenueDataPoint> data = new ArrayList<>();
//
//        for(LocalDateTime dateTime = start; dateTime.isBefore(end); dateTime.plusDays(1)) {
//            BigDecimal revenue = transactionRepository.sumRevenueByDateRange(dateTime, dateTime.plusDays(1).minusNanos(1));
//            if (revenue == null) revenue = BigDecimal.ZERO;
//
//            data.add(RevenueDataPoint.builder()
//                    .date(dateTime.toLocalDate().plusDays(1))
//                    .revenue(revenue)
//                    .build());
//        }
//        return data;
//    }

    public List<RevenueDataPoint> getMonthlyRevenueChart() {
        List<RevenueDataPoint> data = new ArrayList<>();

        for(int i = 1; i <= 12; i++) {
            LocalDateTime start = DateUtils.getStartOfSpecificMonth(i);
            LocalDateTime end = DateUtils.getEndOfSpecificMonth(i);
            BigDecimal revenue = transactionRepository.sumRevenueByDateRange(start,end);
            if (revenue == null) revenue = BigDecimal.ZERO;

            data.add(RevenueDataPoint.builder()
                    .month(i)
                    .revenue(revenue)
                    .build());
        }
        return data;
    }

    public BigDecimal getMonthRevenue(int month){
        LocalDateTime start = DateUtils.getStartOfSpecificMonth(month);
        LocalDateTime end = DateUtils.getEndOfSpecificMonth(month);
        return transactionRepository.sumRevenueByDateRange(start,end);
    }

    public BigDecimal getRevenue(){
        return transactionRepository.sumRevenue();
    }
}
