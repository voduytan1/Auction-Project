import { useEffect, useCallback, useRef } from "react";
import { webSocketService } from "@/services/websocket";
import type {
  BidUpdateCallback,
  BidHistoryCallback,
  ProductStatusCallback,
  TransactionStatusCallback,
} from "@/services/websocket";

interface UseWebSocketOptions {
  productId?: number;
  transactionId?: number;
  onBidUpdate?: BidUpdateCallback;
  onBidHistory?: BidHistoryCallback;
  onProductStatus?: ProductStatusCallback;
  onTransactionStatus?: TransactionStatusCallback;
  enabled?: boolean; // Control subscription from parent
}

/**
 * Custom hook for WebSocket subscriptions on a product or transaction
 * Assumes WebSocket is already connected via WebSocketProvider
 * @param options - Configuration for WebSocket subscriptions
 * @returns Unsubscribe function
 */
export function useWebSocket({
  productId,
  transactionId,
  onBidUpdate,
  onBidHistory,
  onProductStatus,
  onTransactionStatus,
  enabled = true,
}: UseWebSocketOptions) {
  const subscriptionKeysRef = useRef<string[]>([]);

  const unsubscribe = useCallback(() => {
    subscriptionKeysRef.current.forEach((key) => {
      webSocketService.unsubscribe(key);
    });
    subscriptionKeysRef.current = [];
  }, []);

  useEffect(() => {
    if (!enabled || !webSocketService.isConnected()) return;

    // Subscribe to product-related topics
    if (productId && productId > 0) {
      // Subscribe to bid updates
      if (onBidUpdate) {
        const key = webSocketService.subscribeToBidUpdates(
          productId,
          onBidUpdate
        );
        subscriptionKeysRef.current.push(key);
      }

      // Subscribe to bid history
      if (onBidHistory) {
        const key = webSocketService.subscribeToBidHistory(
          productId,
          onBidHistory
        );
        subscriptionKeysRef.current.push(key);
      }

      // Subscribe to product status
      if (onProductStatus) {
        const key = webSocketService.subscribeToProductStatus(
          productId,
          onProductStatus
        );
        subscriptionKeysRef.current.push(key);
      }
    }

    // Subscribe to transaction status
    if (transactionId && transactionId > 0 && onTransactionStatus) {
      const key = webSocketService.subscribeToTransactionStatus(
        transactionId,
        onTransactionStatus
      );
      subscriptionKeysRef.current.push(key);
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [
    productId,
    transactionId,
    onBidUpdate,
    onBidHistory,
    onProductStatus,
    onTransactionStatus,
    enabled,
    unsubscribe,
  ]);

  return { unsubscribe };
}
