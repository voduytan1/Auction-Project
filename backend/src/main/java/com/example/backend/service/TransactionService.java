package com.example.backend.service;

import com.example.backend.dto.transaction.TransactionResponse;
import com.example.backend.entity.Transaction;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.TransactionMapper;
import com.example.backend.repository.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    public TransactionResponse findOne(Long id, String userid){
        Transaction transaction = transactionRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Không tìm thấy giao dịch với id "+ id));
        if(userid.equals(transaction.getBuyer().getUserid())||userid.equals(transaction.getSeller().getUserid())){
            throw new ForbiddenException("Không có quyền truy cập giao dịch này");
        }
        return transactionMapper.toResponse(transaction);
    }
}
