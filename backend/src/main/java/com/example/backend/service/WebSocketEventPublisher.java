package com.example.backend.service;

import com.example.backend.dto.websocket.BidHistoryItemMessage;
import com.example.backend.dto.websocket.BidUpdateMessage;
import com.example.backend.dto.websocket.ProductStatusMessage;
import com.example.backend.entity.BidHistory;
import com.example.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service để publish WebSocket events
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

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
            log.error("Error publishing bid update for product {}", product.getProductid(), e);
        }
    }

    /**
     * Publish bid history item mới
     * 
     * @param bidHistory BidHistory mới
     */
    public void publishNewBidHistory(BidHistory bidHistory) {
        try {
            BidHistoryItemMessage message = BidHistoryItemMessage.builder()
                    .bidHistoryId(bidHistory.getBidHistoryid())
                    .productId(bidHistory.getProduct().getProductid())
                    .bidderName(maskBidderName(bidHistory.getBidder().getHoVaTen()))
                    .giaDat(bidHistory.getGiaDat())
                    .thoiGianDat(bidHistory.getThoiGianDat())
                    .build();

            // Broadcast tới topic bid history của sản phẩm
            messagingTemplate.convertAndSend(
                    "/topic/product/" + bidHistory.getProduct().getProductid() + "/history",
                    message
            );

            log.info("Published new bid history for product {}", 
                    bidHistory.getProduct().getProductid());
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
     * MASK TÊN BIDDER: "Nguyễn Văn Khoa" -> "****Khoa"
     */
    private String maskBidderName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "****";
        }
        String[] parts = fullName.trim().split("\\s+");
        String lastName = parts[parts.length - 1];
        return "****" + lastName;
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
