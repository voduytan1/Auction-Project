package com.example.backend.service;

import com.example.backend.dto.common.PaginationRequest;
import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.entity.Transaction;
import com.example.backend.entity.TransactionStatus;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.TransactionMapper;
import com.example.backend.repository.TransactionRepository;
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

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    public TransactionService(TransactionRepository transactionRepository, TransactionMapper transactionMapper) {
        this.transactionRepository = transactionRepository;
        this.transactionMapper = transactionMapper;
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
        transaction.setTrangThai(TransactionStatus.PAYMENT_COMPLETED);
        transactionRepository.save(transaction);
        return null;
    }
}
