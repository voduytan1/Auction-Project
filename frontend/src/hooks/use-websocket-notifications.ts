import { useEffect } from "react";
import { webSocketService } from "@/services/websocket";
import { useNotifications } from "@/hooks/use-notification";
import type {
  BidUpdateMessage,
  TransactionStatusMessage,
} from "@/types/websocket";
import type { TransactionStatus } from "@/types/transaction";

/**
 * Hook to listen to WebSocket events and add notifications
 * Should be called in a component that's always mounted (e.g., App.tsx or Layout)
 */
export function useWebSocketNotifications() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!webSocketService.isConnected()) {
      console.warn("[useWebSocketNotifications] WebSocket not connected");
      return;
    }

    // Note: These are global subscriptions that listen to all events
    // In a real app, you might want to subscribe only to specific products/transactions
    // For now, this is just a placeholder setup

    return () => {
      // Cleanup if needed
    };
  }, [addNotification]);
}

/**
 * Hook to add bid notification
 */
export function useBidNotification(productId?: number) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!productId || !webSocketService.isConnected()) return;

    const handleBidUpdate = (message: BidUpdateMessage) => {
      const eventTypeText =
        {
          NEW_BID: "Lượt đấu giá mới",
          AUTO_BID: "Tự động nâng giá",
          BUY_NOW: "Mua ngay",
        }[message.eventType] || message.eventType;

      addNotification({
        type: "bid",
        title: eventTypeText,
        message: `${message.message} - Giá hiện tại: ₫${
          message.giaHienTai?.toLocaleString?.("vi-VN") || "0"
        }`,
        productId,
      });
    };

    // Subscribe to bid updates for this product
    const key = webSocketService.subscribeToBidUpdates(
      productId,
      handleBidUpdate
    );

    return () => {
      webSocketService.unsubscribe(key);
    };
  }, [productId, addNotification]);
}

/**
 * Hook to add transaction notification
 */
export function useTransactionNotification(transactionId?: number) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!transactionId || !webSocketService.isConnected()) return;

    const handleTransactionStatus = (message: TransactionStatusMessage) => {
      const statusText: Record<TransactionStatus, string> = {
        PENDING_PAYMENT: "Chờ thanh toán",
        PAYMENT_COMPLETED: "Đã thanh toán",
        AWAITING_SHIPMENT: "Chờ gửi hàng",
        SHIPPED: "Đã gửi hàng",
        COMPLETED: "Hoàn tất",
        CANCELLED: "Đã hủy",
      };

      addNotification({
        type: "transaction",
        title: "Cập nhật giao dịch",
        message: `${message.message} - Trạng thái: ${
          statusText[message.trangThai] || message.trangThai
        }`,
        transactionId,
      });
    };

    // Subscribe to transaction status for this transaction
    const key = webSocketService.subscribeToTransactionStatus(
      transactionId,
      handleTransactionStatus
    );

    return () => {
      webSocketService.unsubscribe(key);
    };
  }, [transactionId, addNotification]);
}
