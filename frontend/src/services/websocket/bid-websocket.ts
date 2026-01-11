import { baseWebSocketService } from "./base";
import type {
  BidUpdateMessage,
  BidHistoryItemMessage,
  ProductStatusMessage,
  TransactionStatusMessage,
} from "@/types/websocket";

export type BidUpdateCallback = (message: BidUpdateMessage) => void;
export type BidHistoryCallback = (messages: BidHistoryItemMessage[]) => void;
export type ProductStatusCallback = (message: ProductStatusMessage) => void;
export type TransactionStatusCallback = (
  message: TransactionStatusMessage
) => void;

// Counter to generate unique keys for multiple subscriptions
let subscriptionCounter = 0;

/**
 * Bid WebSocket Service
 * Handles all bid-related WebSocket subscriptions
 */
class BidWebSocketService {
  /**
   * Subscribe to bid updates for a product
   * @param productId - Product ID to subscribe to
   * @param callback - Callback function when receiving bid update
   * @param keySuffix - Optional suffix to create unique keys for multiple subscribers
   * @returns Subscription key for unsubscribing
   */
  subscribeToBidUpdates(
    productId: number,
    callback: BidUpdateCallback,
    keySuffix?: string
  ): string {
    const topic = `/topic/product/${productId}/bids`;
    const key = keySuffix
      ? `bids-${productId}-${keySuffix}`
      : `bids-${productId}-${++subscriptionCounter}`;
    return baseWebSocketService["subscribe"]<BidUpdateMessage>(
      topic,
      key,
      callback
    );
  }

  /**
   * Subscribe to bid history updates for a product
   * @param productId - Product ID to subscribe to
   * @param callback - Callback function when receiving bid history (top 5 bids)
   * @param keySuffix - Optional suffix to create unique keys for multiple subscribers
   * @returns Subscription key for unsubscribing
   */
  subscribeToBidHistory(
    productId: number,
    callback: BidHistoryCallback,
    keySuffix?: string
  ): string {
    const topic = `/topic/product/${productId}/history`;
    const key = keySuffix
      ? `history-${productId}-${keySuffix}`
      : `history-${productId}-${++subscriptionCounter}`;
    return baseWebSocketService["subscribe"]<BidHistoryItemMessage[]>(
      topic,
      key,
      callback
    );
  }

  /**
   * Subscribe to product status changes
   * @param productId - Product ID to subscribe to
   * @param callback - Callback function when product status changes
   * @param keySuffix - Optional suffix to create unique keys for multiple subscribers
   * @returns Subscription key for unsubscribing
   */
  subscribeToProductStatus(
    productId: number,
    callback: ProductStatusCallback,
    keySuffix?: string
  ): string {
    const topic = `/topic/product/${productId}/status`;
    const key = keySuffix
      ? `status-${productId}-${keySuffix}`
      : `status-${productId}-${++subscriptionCounter}`;
    return baseWebSocketService["subscribe"]<ProductStatusMessage>(
      topic,
      key,
      callback
    );
  }

  /**
   * Subscribe to transaction status changes
   * @param transactionId - Transaction ID to subscribe to
   * @param callback - Callback function when transaction status changes
   * @param keySuffix - Optional suffix to create unique keys for multiple subscribers
   * @returns Subscription key for unsubscribing
   */
  subscribeToTransactionStatus(
    transactionId: number,
    callback: TransactionStatusCallback,
    keySuffix?: string
  ): string {
    const topic = `/topic/transaction/${transactionId}/status`;
    const key = keySuffix
      ? `transaction-${transactionId}-${keySuffix}`
      : `transaction-${transactionId}-${++subscriptionCounter}`;
    return baseWebSocketService["subscribe"]<TransactionStatusMessage>(
      topic,
      key,
      callback
    );
  }

  /**
   * Unsubscribe all subscriptions for a product
   * @param productId - Product ID to unsubscribe all topics
   */
  unsubscribeProduct(productId: number): void {
    const keys = [
      `bids-${productId}`,
      `history-${productId}`,
      `status-${productId}`,
    ];
    keys.forEach((key) => baseWebSocketService.unsubscribe(key));
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(key: string): void {
    baseWebSocketService.unsubscribe(key);
  }
}

export const bidWebSocketService = new BidWebSocketService();
