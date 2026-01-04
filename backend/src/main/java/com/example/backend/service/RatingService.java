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
import java.util.Optional;
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

        Optional<Rating> existingRatingOpt = ratingRepository.findByRaterUseridAndRateeUseridAndProductProductid(
                raterId, ratee.getUserid(), transaction.getProduct().getProductid()
        );

        int inputDiemMoi = createRatingRequest.getDiem(); // 1 hoặc -1
        double diemQuyDoiMoi = (inputDiemMoi == 1) ? 100.0 : 0.0;

        Rating ratingToSave;

        if (existingRatingOpt.isPresent()) {
            // === TRƯỜNG HỢP 1: ĐÃ TỒN TẠI -> CẬP NHẬT (UPDATE) ===
            Rating existingRating = existingRatingOpt.get();

            int inputDiemCu = existingRating.getDiem();

            // Chỉ tính toán lại điểm nếu điểm số thay đổi (VD: từ Tốt -> Tệ hoặc ngược lại)
            if (inputDiemCu != inputDiemMoi) {
                double diemQuyDoiCu = (inputDiemCu == 1) ? 100.0 : 0.0;

                Integer currentCount = ratee.getSoLuongDanhGia();
                Double currentAvg = ratee.getDiemDanhGia();

                // Công thức: (Tổng điểm cũ - Điểm đánh giá cũ + Điểm đánh giá mới) / Số lượng cũ
                double currentTotalScore = currentAvg * currentCount;
                double newTotalScore = currentTotalScore - diemQuyDoiCu + diemQuyDoiMoi;

                double newAvg = newTotalScore / currentCount;

                // Làm tròn 2 chữ số thập phân
                newAvg = (double) Math.round(newAvg * 100) / 100;

                ratee.setDiemDanhGia(newAvg);
                // ratee.setSoLuongDanhGia() -> KHÔNG ĐỔI
            }

            // Cập nhật nội dung đánh giá
            existingRating.setDiem(inputDiemMoi);
            existingRating.setNhanXet(createRatingRequest.getNhanXet());
            // existingRating.setUpdatedAt(LocalDateTime.now()); // Nếu có field này

            ratingToSave = existingRating;

        } else {
            // === TRƯỜNG HỢP 2: CHƯA TỒN TẠI -> TẠO MỚI (CREATE) ===
            Integer soluongDanhGia = ratee.getSoLuongDanhGia();

            if (soluongDanhGia == null || soluongDanhGia == 0) {
                ratee.setDiemDanhGia(diemQuyDoiMoi);
                ratee.setSoLuongDanhGia(1);
            } else {
                // Công thức: (Tổng điểm cũ + Điểm mới) / (Số lượng cũ + 1)
                double diemTichLuyHienTai = ratee.getDiemDanhGia() * soluongDanhGia;
                double diemMoi = (diemTichLuyHienTai + diemQuyDoiMoi) / (soluongDanhGia + 1);

                diemMoi = (double) Math.round(diemMoi * 100) / 100;

                ratee.setDiemDanhGia(diemMoi);
                ratee.setSoLuongDanhGia(soluongDanhGia + 1);
            }

            ratingToSave = Rating.builder()
                    .rater(rater)
                    .ratee(ratee) // Lưu ý: Entity User đã được set lại điểm ở trên
                    .product(transaction.getProduct())
                    .diem(inputDiemMoi)
                    .nhanXet(createRatingRequest.getNhanXet())
                    .build();
        }

        // Lưu User (đã cập nhật điểm)
        User savedRatee = userRepository.save(ratee);

        // Đảm bảo Rating trỏ tới User mới nhất (nếu cần thiết với JPA, thường thì object reference tự handle)
        ratingToSave.setRatee(savedRatee);

        // Lưu Rating
        Rating savedRating = ratingRepository.save(ratingToSave);

        return ratingMapper.toResponse(savedRating);
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
