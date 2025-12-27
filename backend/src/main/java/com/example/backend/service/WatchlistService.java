package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.entity.WatchList;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WatchlistRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class WatchlistService {
    private final WatchlistRepository watchlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WatchlistService(WatchlistRepository watchlistRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.watchlistRepository = watchlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WatchList createOne(Long productid, UUID userId) {
        Product product = productRepository.findById(productid).orElseThrow(()->new EntityNotFoundException("Không tìm thấy sản phẩm với id "+ productid));
        User user = userRepository.findById(userId).orElseThrow(()->new EntityNotFoundException("Không tìm thấy user với id "+ userId));
        if(watchlistRepository.existsByUser_UseridAndProduct_Productid(userId, productid)){
            throw new IllegalArgumentException("Bạn đã theo dõi sản phẩm này rồi");
        }
        WatchList watchList = WatchList.builder()
                .product(product)
                .user(user)
                .build();


        return watchlistRepository.save(watchList);
    }

    public List<WatchList> getOwn(UUID userId){
        User user = userRepository.findById(userId).orElseThrow(()->new EntityNotFoundException("Không tìm thấy user với id "+ userId));
        return watchlistRepository.findByUser_Userid(userId);
    }

    @Transactional
    public Void deleteOne(UUID userId, Long productid) {
        WatchList watchList = watchlistRepository.findByUser_UseridAndProduct_Productid(userId,productid).orElseThrow(()->new EntityNotFoundException("Không tìm thấy lượt theo dõi"));
        watchlistRepository.delete(watchList);
        return null;
    }
}
