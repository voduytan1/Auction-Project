package com.example.backend.service;

import com.example.backend.dto.product.question.AnswerProductQuestionRequest;
import com.example.backend.dto.product.question.CreateProductQuestionRequest;
import com.example.backend.dto.product.question.ProductQuestionResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductQuestion;
import com.example.backend.entity.User;
import com.example.backend.exception.ForbiddenException;
import com.example.backend.mapper.ProductQuestionMapper;
import com.example.backend.repository.ProductQuestionRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ProductQuestionService {
    private final ProductQuestionRepository productQuestionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductQuestionMapper productQuestionMapper;

    public ProductQuestionService(ProductQuestionRepository productQuestionRepository, UserRepository userRepository, ProductRepository productRepository, ProductQuestionMapper productQuestionMapper) {
        this.productQuestionRepository = productQuestionRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productQuestionMapper = productQuestionMapper;
    }

    @Transactional
    public ProductQuestionResponse createOne(CreateProductQuestionRequest createProductQuestionRequest, UUID userId) {
        User asker = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id "+ userId));

        Product product = productRepository.findById(createProductQuestionRequest.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nsản phẩm với id " +  createProductQuestionRequest.getProductId()));

        ProductQuestion productQuestion = productQuestionMapper.toEntity(createProductQuestionRequest);
        productQuestion.setProduct(product);
        productQuestion.setAsker(asker);

        ProductQuestion saved = productQuestionRepository.save(productQuestion);
        return productQuestionMapper.toResponse(saved);
    }

    public Page<@NotNull ProductQuestionResponse> findAllByProduct(Long productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nsản phẩm với id " +  productId));

        Page<@NotNull ProductQuestion> page = productQuestionRepository.findByProduct_Productid(product.getProductid(), pageable);

        return page.map(productQuestionMapper::toResponse);
    }

    public ProductQuestionResponse updateOne(AnswerProductQuestionRequest request, UUID userId, Long productQuestionId) {
        User answer = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id "+ userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nsản phẩm với id " +  request.getProductId()));

        ProductQuestion productQuestion = productQuestionRepository.findById(productQuestionId)
                .orElseThrow(()->new EntityNotFoundException("Không tìm thấy câu hỏi với id "+ productQuestionId));

        if(!answer.equals(product.getSeller())){
            throw new ForbiddenException("Bạn không phải người bán sản phẩm này");
        }

        if(!product.equals(productQuestion.getProduct())){
            throw new IllegalArgumentException("Câu hỏi không thuộc về sản phẩm bạn đã truyền");
        }

        productQuestionMapper.updateEntity(request, productQuestion);

        productQuestion.setThoiGianTraLoi(LocalDateTime.now());

        ProductQuestion saved = productQuestionRepository.save(productQuestion);

        return  productQuestionMapper.toResponse(saved);
    }
}
