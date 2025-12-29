package com.example.backend.service;

import com.example.backend.dto.rating.CreateRatingRequest;
import com.example.backend.dto.rating.RatingResponse;
import com.example.backend.entity.*;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.RatingMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.RatingRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RatingMapper ratingMapper;
    private final TransactionRepository transactionRepository;

    public RatingService(RatingRepository ratingRepository, UserRepository userRepository, ProductRepository productRepository, RatingMapper ratingMapper, TransactionRepository transactionRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.ratingMapper = ratingMapper;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public RatingResponse createOne(CreateRatingRequest createRatingRequest, UUID raterId) {

        Transaction transaction = validateTransaction(createRatingRequest.getTransactionId());

        User rater = validateUser(raterId,transaction);

        User ratee = validateUser(createRatingRequest.getRateeId(),transaction);

        if(ratingRepository.existsByRaterUseridAndRateeUseridAndProductProductid(raterId,ratee.getUserid(),transaction.getProduct().getProductid())){
            throw new IllegalStateException("Bạn đã đánh giá rồi");
        }

        Integer soluongDanhGia = ratee.getSoLuongDanhGia();
        if(soluongDanhGia==null ||soluongDanhGia==0){
            ratee.setDiemDanhGia(createRatingRequest.getDiem().doubleValue());
            ratee.setSoLuongDanhGia(1);
        }else {
            ratee.setDiemDanhGia(ratee.getDiemDanhGia() + (createRatingRequest.getDiem() / soluongDanhGia));
            ratee.setSoLuongDanhGia(soluongDanhGia + 1);
        }
        User savedRatee = userRepository.save(ratee);

        Rating rate = Rating.builder()
                .rater(rater)
                .ratee(savedRatee)
                .product(transaction.getProduct())
                .diem(createRatingRequest.getDiem())
                .nhanXet(createRatingRequest.getNhanXet())
                .build();

        Rating saved = ratingRepository.save(rate);

        return ratingMapper.toResponse(saved);
    }


    @NotNull
    private User validateUser(UUID rateeId, Transaction transaction) {
        User rater = userRepository.findById(rateeId).orElseThrow(()-> new EntityNotFoundException("Không tìm thấy user với id "+ rateeId));
        if(!rater.getUserid().equals(transaction.getBuyer().getUserid())&&!rater.getUserid().equals(transaction.getSeller().getUserid())){
            throw new ForbiddenException("Bạn không có mặt trong giao dịch với id " + transaction.getTransactionid());
        }
        return rater;
    }

    private Transaction validateTransaction(Long transactionId){
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(()->new EntityNotFoundException("Không tìm thấy giao dịch với id "+ transactionId));
        if(!TransactionStatus.COMPLETED.equals(transaction.getTrangThai()) && !TransactionStatus.CANCELLED.equals(transaction.getTrangThai()) ){
            throw new IllegalStateException("Đơn hàng phải ở trạng thái hoàn thành hoặc đã hủy trước khi đánh giá");
        }
        return transaction;
    }

    public Page<@NotNull RatingResponse> getAllByRaterId(UUID raterId, Pageable pageable) {
        Page<@NotNull Rating> page = ratingRepository.findByRaterUserid(raterId, pageable);
        return page.map(ratingMapper::toResponse);
    }

    public Page<@NotNull RatingResponse> getAllByRateeId(UUID rateeId, Pageable pageable) {
        Page<@NotNull Rating> page = ratingRepository.findByRateeUserid(rateeId, pageable);
        return page.map(ratingMapper::toResponse);
    }
}
