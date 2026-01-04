package com.example.backend.repository;

import com.example.backend.entity.Rating;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Lấy danh sách rating của user (người được đánh giá)
    Page<@NotNull Rating> findByRateeUseridOrderByCreatedAtDesc(UUID rateeid, Pageable pageable);

    // Lấy danh sách rating mà user đã đánh giá người khác
    Page<@NotNull Rating> findByRaterUseridOrderByCreatedAtDesc(UUID raterid, Pageable pageable);

    // Đếm tổng số lượt đánh giá
    Long countByRateeUserid(UUID rateeid);

    // Đếm số đánh giá theo điểm
    Long countByRateeUseridAndDiem(UUID rateeid, Integer diem);

    // Tính rating percentage của user
    @Query("SELECT " +
            "CASE WHEN COUNT(r) = 0 THEN 0 " +
            "ELSE (SUM(CASE WHEN r.diem = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(r)) " +
            "END " +
            "FROM Rating r WHERE r.ratee.userid = :userid")
    Double calculateRatingPercentage(@Param("userid") UUID userid);

    // Check đã đánh giá chưa
    boolean existsByRaterUseridAndRateeUseridAndProductProductid(
            UUID raterid, UUID rateeid, Long productid
    );



    // Lấy rating giữa 2 user trên 1 sản phẩm
    Optional<Rating> findByRaterUseridAndRateeUseridAndProductProductid(
            UUID raterid, UUID rateeid, Long productid
    );

    // Lấy tất cả rating của 1 sản phẩm
    List<Rating> findByProductProductid(Long productid);

    Page<Rating> findByRaterUserid(UUID userid, Pageable pageable);

    Page<Rating> findByRateeUserid(UUID userid, Pageable pageable);

}