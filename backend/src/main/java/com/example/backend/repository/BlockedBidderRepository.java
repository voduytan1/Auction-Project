package com.example.backend.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Repository;
import com.example.backend.entity.BlockedBidder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockedBidderRepository extends JpaRepository<@NotNull BlockedBidder, @NotNull Long> {

    // Check bidder có bị block trên sản phẩm không
    boolean existsByProductProductidAndBidderUserid(Long product_productid, UUID bidder_userid);

    // Tìm block record
    Optional<BlockedBidder> findByProductProductidAndBidderUserid(Long product_productid, UUID bidder_userid);

    // Lấy danh sách bidder bị block của 1 sản phẩm
    List<BlockedBidder> findByProductProductid(Long productid);

    // Lấy danh sách sản phẩm mà bidder bị block
    List<BlockedBidder> findByBidderUserid(UUID bidder_userid);

    // Lấy danh sách blocked bidders do seller tạo
    List<BlockedBidder> findBySellerUserid(UUID seller_userid);
}
