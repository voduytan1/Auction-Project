/**
 * @deprecated This file is deprecated. Import from './websocket/index' instead.
 * Kept for backward compatibility.
 */

import { baseWebSocketService } from "./websocket/base";
import { bidWebSocketService } from "./websocket/bid-websocket";
import { chatWebSocketService } from "./websocket/chat-websocket";

export type {
  BidUpdateCallback,
  BidHistoryCallback,
  ProductStatusCallback,
  TransactionStatusCallback,
} from "./websocket/bid-websocket";
export type {
  ChatMessageCallback,
  TypingIndicatorCallback,
} from "./websocket/chat-websocket";

/**
 * Unified WebSocket Service (Backward Compatibility)
 * This combines all services into one object to maintain existing API
 */
class WebSocketService {
  // Connection methods
  connect = () => baseWebSocketService.connect();
  disconnect = () => baseWebSocketService.disconnect();
  isConnected = () => baseWebSocketService.isConnected();

  // Bid methods
  subscribeToBidUpdates =
    bidWebSocketService.subscribeToBidUpdates.bind(bidWebSocketService);
  subscribeToBidHistory =
    bidWebSocketService.subscribeToBidHistory.bind(bidWebSocketService);
  subscribeToProductStatus =
    bidWebSocketService.subscribeToProductStatus.bind(bidWebSocketService);
  subscribeToTransactionStatus =
    bidWebSocketService.subscribeToTransactionStatus.bind(bidWebSocketService);
  unsubscribeProduct =
    bidWebSocketService.unsubscribeProduct.bind(bidWebSocketService);

  // Chat methods
  subscribeToChatMessages =
    chatWebSocketService.subscribeToChatMessages.bind(chatWebSocketService);
  subscribeToTypingIndicator =
    chatWebSocketService.subscribeToTypingIndicator.bind(chatWebSocketService);
  sendTypingIndicator =
    chatWebSocketService.sendTypingIndicator.bind(chatWebSocketService);

  // General unsubscribe
  unsubscribe = (key: string) => baseWebSocketService.unsubscribe(key);
}

// Singleton instance
export const webSocketService = new WebSocketService();
