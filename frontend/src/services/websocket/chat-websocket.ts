import { baseWebSocketService } from "./base";
import type { ChatMessageWS, TypingIndicator } from "@/types/websocket";

export type ChatMessageCallback = (message: ChatMessageWS) => void;
export type TypingIndicatorCallback = (indicator: TypingIndicator) => void;

/**
 * Chat WebSocket Service
 * Handles all chat-related WebSocket subscriptions
 */
class ChatWebSocketService {
  /**
   * Subscribe to chat messages for a transaction
   * @param transactionId - Transaction ID to subscribe to
   * @param callback - Callback function when receiving chat message
   * @returns Subscription key for unsubscribing
   */
  subscribeToChatMessages(
    transactionId: number,
    callback: ChatMessageCallback
  ): string {
    const topic = `/topic/transaction/${transactionId}/messages`;
    const key = `chat-${transactionId}`;
    return baseWebSocketService["subscribe"]<ChatMessageWS>(
      topic,
      key,
      callback
    );
  }

  /**
   * Subscribe to typing indicators for a transaction
   * @param transactionId - Transaction ID to subscribe to
   * @param callback - Callback function when receiving typing indicator
   * @returns Subscription key for unsubscribing
   */
  subscribeToTypingIndicator(
    transactionId: number,
    callback: TypingIndicatorCallback
  ): string {
    const topic = `/topic/transaction/${transactionId}/typing`;
    const key = `typing-${transactionId}`;
    return baseWebSocketService["subscribe"]<TypingIndicator>(
      topic,
      key,
      callback
    );
  }

  /**
   * Send typing indicator to server
   * @param transactionId - Transaction ID
   * @param isTyping - Whether user is typing
   */
  sendTypingIndicator(transactionId: number, isTyping: boolean): void {
    const destination = `/app/chat/${transactionId}/typing`;
    const body = {
      transactionid: transactionId,
      isTyping,
    };
    baseWebSocketService["publish"](destination, body);
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(key: string): void {
    baseWebSocketService.unsubscribe(key);
  }
}

export const chatWebSocketService = new ChatWebSocketService();
