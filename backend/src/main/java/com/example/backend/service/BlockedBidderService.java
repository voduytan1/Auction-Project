package com.example.backend.service;

import com.example.backend.dto.blockedbidder.BlockedBidderResponse;
import com.example.backend.dto.blockedbidder.CreateBlockedBidderRequest;
import com.example.backend.entity.BlockedBidder;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.BlockedBidderMapper;
import com.example.backend.repository.AutoBidRepository;
import com.example.backend.repository.BlockedBidderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class BlockedBidderService {
    private final BlockedBidderRepository blockedBidderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BlockedBidderMapper blockedBidderMapper;
    private final AutoBidService autoBidService;

    public BlockedBidderService(BlockedBidderRepository blockedBidderRepository, UserRepository userRepository, ProductRepository productRepository, BlockedBidderMapper blockedBidderMapper, AutoBidService autoBidService) {
        this.blockedBidderRepository = blockedBidderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.blockedBidderMapper = blockedBidderMapper;
        this.autoBidService = autoBidService;
    }

    @Transactional
    public BlockedBidderResponse createOne(CreateBlockedBidderRequest createBlockedBidderRequest, UUID sellerId) {
        User seller = userRepository.findById(sellerId).orElseThrow(()->new EntityNotFoundException("không tìm thấy người bán với id "+sellerId));

        Product product = productRepository.findByIdForUpdate(createBlockedBidderRequest.getProductid())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id " + createBlockedBidderRequest.getProductid()));

        User bidder = userRepository.findById(createBlockedBidderRequest.getBidderid())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Bidder với id " + createBlockedBidderRequest.getBidderid()));

        if(!product.getSeller().equals(seller)){
            throw new ForbiddenException("Bạn không phải người bán của sản phẩm này");
        }

        BlockedBidder blockedBidder = BlockedBidder.builder()
                .seller(seller)
                .bidder(bidder)
                .product(product)
                .lyDo(createBlockedBidderRequest.getLyDo())
                .build();

        BlockedBidder saved = blockedBidderRepository.save(blockedBidder);

        autoBidService.processBlockedBidder(product, blockedBidder);

        return blockedBidderMapper.toResponse(saved);
    }
}
