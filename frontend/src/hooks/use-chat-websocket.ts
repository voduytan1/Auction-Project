import { useEffect, useRef, useState, useCallback } from "react";
import type { ChatMessageWS, TypingIndicator } from "@/types/websocket";
import type { ChatMessage } from "@/services/chat.api";
import { useAppSelector } from "./use-redux";
import { baseWebSocketService } from "@/services/websocket/base";
import { chatWebSocketService } from "@/services/websocket/chat-websocket";

interface UseChatWebSocketProps {
  transactionId: number;
  enabled?: boolean;
  onNewMessage?: (message: ChatMessage) => void;
}

export function useChatWebSocket({
  transactionId,
  enabled = true,
  onNewMessage,
}: UseChatWebSocketProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [otherUserTypingName, setOtherUserTypingName] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);
  // Ref để track trạng thái đã gửi, tránh spam server
  const lastSentTypingStateRef = useRef(false);

  /**
   * Handle incoming chat messages
   */
  const handleChatMessage = useCallback(
    (wsMessage: ChatMessageWS) => {
      console.log("[ChatWS] Received message:", wsMessage);

      // Convert WebSocket message to ChatMessage format (matching backend ChatMessageResponse)
      if (wsMessage.type === "MESSAGE" && wsMessage.messageContent) {
        const chatMessage: ChatMessage = {
          messageid: wsMessage.messageid || 0,
          transactionid: wsMessage.transactionid,
          senderid: wsMessage.senderid,
          senderName: wsMessage.senderName,
          messageContent: wsMessage.messageContent,
          createdAt: wsMessage.timestamp || new Date().toISOString(),
          isRead: false,
        };

        // Call the callback to update UI
        onNewMessage?.(chatMessage);
      }
    },
    [onNewMessage]
  );

  /**
   * Handle incoming typing indicator
   */
  const handleTypingIndicator = useCallback(
    (indicator: TypingIndicator) => {
      console.log("[ChatWS] Typing indicator received:", indicator);

      // Check both possible field names from backend (userid or senderId)
      const indicatorUserId =
        indicator.userid || (indicator as { senderId?: string }).senderId;

      // Ignore own typing events
      if (String(indicatorUserId) === String(user?.userid)) {
        console.log("[ChatWS] Ignoring own typing indicator");
        return;
      }

      setIsOtherUserTyping(indicator.isTyping);
      if (indicator.isTyping) {
        setOtherUserTypingName(indicator.username || "Người dùng");

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Auto hide typing indicator after 3 seconds (safety timeout if 'false' packet is lost)
        typingTimeoutRef.current = setTimeout(() => {
          setIsOtherUserTyping(false);
          setOtherUserTypingName("");
        }, 3000);
      } else {
        setOtherUserTypingName("");
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [user?.userid]
  );

  /**
   * Start typing - Gửi TRUE ngay lập tức (không debounce)
   * Chỉ gửi nếu trạng thái trước đó là FALSE để tránh spam server
   */
  const startTyping = useCallback(() => {
    if (!baseWebSocketService.isConnected()) return;

    if (!lastSentTypingStateRef.current) {
      chatWebSocketService.sendTypingIndicator(transactionId, true);
      lastSentTypingStateRef.current = true;
      console.log("[ChatWS] Sent typing: START");
    }
  }, [transactionId]);

  /**
   * Stop typing - Gửi FALSE ngay lập tức
   * Chỉ gửi nếu trạng thái trước đó là TRUE
   */
  const stopTyping = useCallback(() => {
    if (!baseWebSocketService.isConnected()) return;

    if (lastSentTypingStateRef.current) {
      chatWebSocketService.sendTypingIndicator(transactionId, false);
      lastSentTypingStateRef.current = false;
      console.log("[ChatWS] Sent typing: STOP");
    }
  }, [transactionId]);

  /**
   * Connect and subscribe to WebSocket topics
   */
  useEffect(() => {
    if (!enabled) {
      console.log("[ChatWS] WebSocket disabled");
      return;
    }

    let chatSubKey: string | null = null;
    let typingSubKey: string | null = null;

    const initWebSocket = async () => {
      try {
        console.log("[ChatWS] Initializing WebSocket...");

        // Connect if not connected
        if (!baseWebSocketService.isConnected()) {
          console.log("[ChatWS] Connecting to WebSocket server...");
          await baseWebSocketService.connect();
          console.log("[ChatWS] WebSocket connected successfully");
        } else {
          console.log("[ChatWS] WebSocket already connected");
        }

        console.log(
          "[ChatWS] Subscribing to topics for transaction:",
          transactionId
        );

        // Subscribe to chat messages
        chatSubKey = chatWebSocketService.subscribeToChatMessages(
          transactionId,
          handleChatMessage
        );
        console.log("[ChatWS] Subscribed to messages with key:", chatSubKey);

        // Subscribe to typing indicator
        typingSubKey = chatWebSocketService.subscribeToTypingIndicator(
          transactionId,
          handleTypingIndicator
        );
        console.log("[ChatWS] Subscribed to typing with key:", typingSubKey);
      } catch (error) {
        console.error("[ChatWS] Failed to connect:", error);
      }
    };

    initWebSocket();

    return () => {
      console.log("[ChatWS] Cleaning up subscriptions");
      if (chatSubKey) {
        chatWebSocketService.unsubscribe(chatSubKey);
        console.log("[ChatWS] Unsubscribed from messages");
      }
      if (typingSubKey) {
        chatWebSocketService.unsubscribe(typingSubKey);
        console.log("[ChatWS] Unsubscribed from typing");
      }
    };
  }, [enabled, transactionId, handleChatMessage, handleTypingIndicator]);

  /**
   * Cleanup timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOtherUserTyping,
    otherUserTypingName,
    startTyping,
    stopTyping,
  };
}
