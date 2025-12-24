package com.example.backend.repository;


import com.example.backend.entity.AutoBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AutoBidRepository extends JpaRepository<AutoBid, Long> {

    // Tìm autobid của 1 bidder trên 1 sản phẩm
    Optional<AutoBid> findByProductProductidAndBidderUseridAndIsActiveTrue(
            Long productid, UUID bidderid
    );

    // Lấy tất cả autobid active của 1 sản phẩm, sắp xếp theo giá tối đa giảm dần
    @Query("SELECT ab FROM AutoBid ab WHERE ab.product.productid = :productid " +
            "AND ab.isActive = true ORDER BY ab.giaToiDa DESC, ab.createdAt ASC")
    List<AutoBid> findActiveAutoBidsByProductOrderByGiaToiDaDesc(@Param("productid") Long productid);

    // Lấy autobid có giá cao nhất của sản phẩm
    @Query("SELECT ab FROM AutoBid ab WHERE ab.product.productid = :productid " +
            "AND ab.isActive = true ORDER BY ab.giaToiDa DESC, ab.createdAt ASC LIMIT 1")
    Optional<AutoBid> findHighestAutoBidByProduct(@Param("productid") Long productid);

    // Lấy autobid có giá cao thứ 2
    @Query("SELECT ab FROM AutoBid ab WHERE ab.product.productid = :productid " +
            "AND ab.isActive = true ORDER BY ab.giaToiDa DESC, ab.createdAt ASC LIMIT 1 OFFSET 1")
    Optional<AutoBid> findSecondHighestAutoBidByProduct(@Param("productid") Long productid);

    // Lấy danh sách autobid của 1 bidder
    List<AutoBid> findByBidderUseridAndIsActiveTrueOrderByCreatedAtDesc(UUID bidderid);

    // Lấy autobid của bidder trên các sản phẩm đang active
    @Query("SELECT ab FROM AutoBid ab WHERE ab.bidder.userid = :bidderid " +
            "AND ab.isActive = true AND ab.product.trangThai = 'ACTIVE' " +
            "ORDER BY ab.createdAt DESC")
    List<AutoBid> findActiveAutoBidsByBidderOnActiveProducts(@Param("bidderid") UUID bidderid);
}
