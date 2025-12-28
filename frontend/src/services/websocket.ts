import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type {
  BidUpdateMessage,
  BidHistoryItemMessage,
  ProductStatusMessage,
  TransactionStatusMessage,
} from "@/types/websocket";
import { env } from "@/config/env";

export type BidUpdateCallback = (message: BidUpdateMessage) => void;
export type BidHistoryCallback = (messages: BidHistoryItemMessage[]) => void;
export type ProductStatusCallback = (message: ProductStatusMessage) => void;
export type TransactionStatusCallback = (
  message: TransactionStatusMessage
) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(env.WS_URL) as WebSocket,
        debug: (_str) => {},
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          this.reconnectAttempts = 0;
          resolve();
        },
        onStompError: (frame) => {
          console.error("[WebSocket] STOMP error:", frame.headers["message"]);
          console.error("[WebSocket] Details:", frame.body);
          reject(new Error(frame.headers["message"]));
        },
        onWebSocketError: (event) => {
          console.error("[WebSocket] WebSocket error:", event);
          reject(event);
        },
        onDisconnect: () => {
          this.handleReconnect();
        },
      });

      this.client.activate();
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
    } else {
      console.error("[WebSocket] Max reconnect attempts reached");
    }
  }

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

    if (this.subscriptions.has(key)) {
      console.warn(`[WebSocket] Already subscribed to ${topic}`);
      return key;
    }

    if (!this.client?.connected) {
      console.error("[WebSocket] Not connected. Cannot subscribe.");
      return key;
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data: BidUpdateMessage = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("[WebSocket] Error parsing bid update:", error);
      }
    });

    this.subscriptions.set(key, subscription);
    return key;
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

    if (this.subscriptions.has(key)) {
      console.warn(`[WebSocket] Already subscribed to ${topic}`);
      return key;
    }

    if (!this.client?.connected) {
      console.error("[WebSocket] Not connected. Cannot subscribe.");
      return key;
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data: BidHistoryItemMessage[] = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("[WebSocket] Error parsing bid history:", error);
      }
    });

    this.subscriptions.set(key, subscription);
    return key;
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

    if (this.subscriptions.has(key)) {
      console.warn(`[WebSocket] Already subscribed to ${topic}`);
      return key;
    }

    if (!this.client?.connected) {
      console.error("[WebSocket] Not connected. Cannot subscribe.");
      return key;
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data: ProductStatusMessage = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("[WebSocket] Error parsing product status:", error);
      }
    });

    this.subscriptions.set(key, subscription);
    return key;
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

    if (this.subscriptions.has(key)) {
      console.warn(`[WebSocket] Already subscribed to ${topic}`);
      return key;
    }

    if (!this.client?.connected) {
      console.error("[WebSocket] Not connected. Cannot subscribe.");
      return key;
    }

    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data: TransactionStatusMessage = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("[WebSocket] Error parsing transaction status:", error);
      }
    });

    this.subscriptions.set(key, subscription);
    return key;
  }

  /**
   * Unsubscribe from a topic
   * @param key - Subscription key returned from subscribe methods
   */
  unsubscribe(key: string): void {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
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
    keys.forEach((key) => this.unsubscribe(key));
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
