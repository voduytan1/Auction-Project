package com.example.backend.service;

import com.example.backend.dto.websocket.BidHistoryItemMessage;
import com.example.backend.dto.websocket.BidUpdateMessage;
import com.example.backend.dto.websocket.ProductStatusMessage;
import com.example.backend.entity.BidHistory;
import com.example.backend.entity.Product;
import com.example.backend.repository.BidHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.backend.utils.MyStringUtils.maskBidderName;

/**
 * Service để publish WebSocket events
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;
    private final BidHistoryRepository bidHistoryRepository;

    /**
     * Broadcast bid update cho tất cả clients đang xem sản phẩm
     * 
     * @param product Product đã được cập nhật
     * @param eventType Loại event: NEW_BID, AUTO_BID, BUY_NOW
     */
    public void publishBidUpdate(Product product, String eventType) {
        try {
            BidUpdateMessage message = BidUpdateMessage.builder()
                    .productId(product.getProductid())
                    .giaHienTai(product.getGiaHienTai())
                    .currentBidder(maskBidderName(product.getCurrentBidder() != null ? 
                            product.getCurrentBidder().getHoVaTen() : null))
                    .soLuotRaGia(product.getSoLuotRaGia())
                    .thoiGianDat(LocalDateTime.now())
                    .eventType(eventType)
                    .message(buildBidMessage(eventType))
                    .build();

            // Broadcast tới topic của sản phẩm cụ thể
            messagingTemplate.convertAndSend(
                    "/topic/product/" + product.getProductid() + "/bids",
                    message
            );

            log.info("Published bid update for product {} - Type: {}", 
                    product.getProductid(), eventType);
        } catch (Exception e) {
            log.error("Error publishing bid update for product {}", 
                    product.getProductid(), e);
        }
    }

    /**
     * Broadcast 5 lượt đặt giá gần nhất
     * 
     * @param bidHistory BidHistory mới (trigger để load 5 items gần nhất)
     */
    public void publishNewBidHistory(BidHistory bidHistory) {
        try {
            Long productId = bidHistory.getProduct().getProductid();
            
            // Query 5 bid history gần nhất
            Pageable topFive = PageRequest.of(0, 5);
            List<BidHistory> latestBids = bidHistoryRepository
                    .findByProductProductidOrderByCreatedAtDesc(productId, topFive)
                    .getContent();
            
            // Convert sang DTO
            List<BidHistoryItemMessage> messages = latestBids.stream()
                    .map(bh -> BidHistoryItemMessage.builder()
                            .bidHistoryId(bh.getBidHistoryid())
                            .productId(bh.getProduct().getProductid())
                            .bidderName(maskBidderName(bh.getBidder().getHoVaTen()))
                            .giaDat(bh.getGiaDat())
                            .thoiGianDat(bh.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());

            // Broadcast list 5 items mới nhất tới topic bid history
            messagingTemplate.convertAndSend(
                    "/topic/product/" + productId + "/history",
                    messages
            );

            log.info("Published {} latest bid histories for product {}", 
                    messages.size(), productId);
        } catch (Exception e) {
            log.error("Error publishing bid history", e);
        }
    }

    /**
     * Publish product status change
     * 
     * @param product Product
     * @param status Status mới
     * @param message Message
     */
    public void publishProductStatusChange(Product product, String status, String message) {
        try {
            ProductStatusMessage statusMessage = ProductStatusMessage.builder()
                    .productId(product.getProductid())
                    .status(status)
                    .message(message)
                    .winnerId(product.getCurrentBidder() != null ? 
                            product.getCurrentBidder().getUserid().toString() : null)
                    .winnerName(product.getCurrentBidder() != null ? 
                            maskBidderName(product.getCurrentBidder().getHoVaTen()) : null)
                    .build();

            // Broadcast tới topic của sản phẩm
            messagingTemplate.convertAndSend(
                    "/topic/product/" + product.getProductid() + "/status",
                    statusMessage
            );

            log.info("Published status change for product {} - Status: {}", 
                    product.getProductid(), status);
        } catch (Exception e) {
            log.error("Error publishing status change for product {}", 
                    product.getProductid(), e);
        }
    }

    /**
     * Gửi notification cho user cụ thể
     * 
     * @param userId User ID
     * @param message Message
     */
    public void sendNotificationToUser(String userId, Object message) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    message
            );
            
            log.info("Sent notification to user {}", userId);
        } catch (Exception e) {
            log.error("Error sending notification to user {}", userId, e);
        }
    }



    /**
     * Build message dựa trên event type
     */
    private String buildBidMessage(String eventType) {
        return switch (eventType) {
            case "NEW_BID" -> "Có lượt đặt giá mới";
            case "AUTO_BID" -> "Giá được cập nhật tự động";
            case "BUY_NOW" -> "Sản phẩm đã được mua ngay";
            default -> "Giá sản phẩm đã thay đổi";
        };
    }
}
