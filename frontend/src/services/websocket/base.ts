import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { env } from "@/config/env";

/**
 * Base WebSocket Service
 * Provides core WebSocket connection and subscription management
 * Supports multiple callbacks per topic (multi-subscriber pattern)
 */
class BaseWebSocketService {
  private client: Client | null = null;
  // Map topic -> subscription
  protected subscriptions: Map<string, StompSubscription> = new Map();
  // Map topic -> Map<key, callback>
  protected callbacks: Map<string, Map<string, (data: unknown) => void>> =
    new Map();
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
        debug: () => {},
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
      this.callbacks.clear();
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
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * Subscribe to a topic with callback
   * Supports multiple callbacks per topic (multi-subscriber pattern)
   */
  protected subscribe<T>(
    topic: string,
    key: string,
    callback: (data: T) => void
  ): string {
    // Check if this specific key already has a callback
    const topicCallbacks = this.callbacks.get(topic);
    if (topicCallbacks?.has(key)) {
      console.warn(
        `[WebSocket] Key ${key} already subscribed to ${topic}, updating callback`
      );
      // Update the callback instead of ignoring
      topicCallbacks.set(key, callback as (data: unknown) => void);
      return key;
    }

    if (!this.client?.connected) {
      console.error(`[WebSocket] Not connected. Cannot subscribe to ${topic}.`);
      return key;
    }

    // Initialize callbacks map for this topic if needed
    if (!this.callbacks.has(topic)) {
      this.callbacks.set(topic, new Map());
    }

    // Add this callback
    this.callbacks.get(topic)!.set(key, callback as (data: unknown) => void);

    // If topic already has a subscription, just add the callback
    if (this.subscriptions.has(topic)) {
      console.log(
        `[WebSocket] Added callback ${key} to existing subscription for ${topic}`
      );
      return key;
    }

    // Create new subscription for this topic
    try {
      const subscription = this.client.subscribe(topic, (message: IMessage) => {
        try {
          console.log(
            `[WebSocket] Received message from ${topic}:`,
            message.body
          );
          const data: T = JSON.parse(message.body);

          // Invoke all callbacks for this topic
          const callbacks = this.callbacks.get(topic);
          if (callbacks) {
            callbacks.forEach((cb, cbKey) => {
              console.log(
                `[WebSocket] Invoking callback ${cbKey} for ${topic}`
              );
              cb(data);
            });
          }
        } catch (error) {
          console.error(
            `[WebSocket] Error parsing message from ${topic}:`,
            error
          );
        }
      });

      this.subscriptions.set(topic, subscription);
      console.log(
        `[WebSocket] Successfully subscribed to ${topic} with key ${key}`
      );
      return key;
    } catch (error) {
      console.error(`[WebSocket] Error subscribing to ${topic}:`, error);
      return key;
    }
  }

  /**
   * Publish message to a destination
   */
  protected publish(destination: string, body: object): void {
    if (!this.client?.connected) {
      console.error(
        `[WebSocket] Not connected. Cannot publish to ${destination}.`
      );
      return;
    }

    try {
      console.log(`[WebSocket] Publishing to ${destination}:`, body);
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
      console.log(`[WebSocket] Published successfully to ${destination}`);
    } catch (error) {
      console.error(`[WebSocket] Error publishing to ${destination}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic by key
   * Only removes the subscription when no callbacks remain
   */
  unsubscribe(key: string): void {
    // Find which topic this key belongs to
    for (const [topic, callbacks] of this.callbacks.entries()) {
      if (callbacks.has(key)) {
        callbacks.delete(key);
        console.log(`[WebSocket] Removed callback ${key} from ${topic}`);

        // If no more callbacks for this topic, unsubscribe from STOMP
        if (callbacks.size === 0) {
          const subscription = this.subscriptions.get(topic);
          if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            console.log(
              `[WebSocket] Unsubscribed from ${topic} (no more callbacks)`
            );
          }
          this.callbacks.delete(topic);
        }
        return;
      }
    }
  }

  /**
   * Public method to publish message (for external services)
   */
  sendMessage(destination: string, body: object): void {
    this.publish(destination, body);
  }

  /**
   * Public method to subscribe (for external services)
   */
  subscribeToTopic<T>(
    topic: string,
    key: string,
    callback: (data: T) => void
  ): string {
    return this.subscribe(topic, key, callback);
  }
}

export const baseWebSocketService = new BaseWebSocketService();
