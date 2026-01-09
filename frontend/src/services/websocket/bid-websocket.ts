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

/**
 * Bid WebSocket Service
 * Handles all bid-related WebSocket subscriptions
 */
class BidWebSocketService {
  /**
   * Subscribe to bid updates for a product
   * @param productId - Product ID to subscribe to
   * @param callback - Callback function when receiving bid update
   * @returns Subscription key for unsubscribing
   */
  subscribeToBidUpdates(
    productId: number,
    callback: BidUpdateCallback
  ): string {
    const topic = `/topic/product/${productId}/bids`;
    const key = `bids-${productId}`;
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
   * @returns Subscription key for unsubscribing
   */
  subscribeToBidHistory(
    productId: number,
    callback: BidHistoryCallback
  ): string {
    const topic = `/topic/product/${productId}/history`;
    const key = `history-${productId}`;
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
   * @returns Subscription key for unsubscribing
   */
  subscribeToProductStatus(
    productId: number,
    callback: ProductStatusCallback
  ): string {
    const topic = `/topic/product/${productId}/status`;
    const key = `status-${productId}`;
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
   * @returns Subscription key for unsubscribing
   */
  subscribeToTransactionStatus(
    transactionId: number,
    callback: TransactionStatusCallback
  ): string {
    const topic = `/topic/transaction/${transactionId}/status`;
    const key = `transaction-${transactionId}`;
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
