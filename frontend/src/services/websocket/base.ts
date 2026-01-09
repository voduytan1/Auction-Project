import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { env } from "@/config/env";

/**
 * Base WebSocket Service
 * Provides core WebSocket connection and subscription management
 */
class BaseWebSocketService {
  private client: Client | null = null;
  protected subscriptions: Map<string, StompSubscription> = new Map();
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
   */
  protected subscribe<T>(
    topic: string,
    key: string,
    callback: (data: T) => void
  ): string {
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
        const data: T = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error(
          `[WebSocket] Error parsing message from ${topic}:`,
          error
        );
      }
    });

    this.subscriptions.set(key, subscription);
    return key;
  }

  /**
   * Publish message to a destination
   */
  protected publish(destination: string, body: object): void {
    if (!this.client?.connected) {
      console.error("[WebSocket] Not connected. Cannot publish.");
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(`[WebSocket] Error publishing to ${destination}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(key: string): void {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }
}

export const baseWebSocketService = new BaseWebSocketService();
