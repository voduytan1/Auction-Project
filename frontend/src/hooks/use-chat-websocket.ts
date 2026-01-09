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
  const lastTypingStateRef = useRef(false);
  const typingDebounceRef = useRef<number | null>(null);

  /**
   * Handle incoming chat messages
   */
  const handleChatMessage = useCallback(
    (wsMessage: ChatMessageWS) => {
      console.log("[ChatWS] Received message:", wsMessage);

      // Convert WebSocket message to ChatMessage format
      if (wsMessage.type === "MESSAGE" && wsMessage.messageContent) {
        const chatMessage: ChatMessage = {
          id: wsMessage.messageid || 0,
          transactionId: wsMessage.transactionid,
          senderId: wsMessage.senderid,
          senderName: wsMessage.senderName,
          message: wsMessage.messageContent,
          timestamp: wsMessage.timestamp || new Date().toISOString(),
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
      console.log("[ChatWS] Typing indicator:", indicator);

      // Ignore own typing events
      if (indicator.userid === user?.userid) {
        return;
      }

      setIsOtherUserTyping(indicator.isTyping);
      if (indicator.isTyping) {
        setOtherUserTypingName(indicator.username || "");

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Auto hide typing indicator after 3 seconds
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
   * Debounced function to send typing indicator to server
   */
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!baseWebSocketService.isConnected()) return;

      // Debounce typing indicator to avoid flooding the server
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      typingDebounceRef.current = setTimeout(() => {
        if (lastTypingStateRef.current !== isTyping) {
          chatWebSocketService.sendTypingIndicator(transactionId, isTyping);
          lastTypingStateRef.current = isTyping;
          console.log("[ChatWS] Typing indicator sent:", isTyping);
        }
      }, 300); // 300ms debounce
    },
    [transactionId]
  );

  /**
   * Start typing - sends typing indicator to server (debounced)
   */
  const startTyping = useCallback(() => {
    if (!baseWebSocketService.isConnected()) return;

    sendTypingIndicator(true);
  }, [sendTypingIndicator]);

  /**
   * Stop typing - sends stop typing indicator to server
   */
  const stopTyping = useCallback(() => {
    if (!baseWebSocketService.isConnected()) return;

    sendTypingIndicator(false);
  }, [sendTypingIndicator]);

  /**
   * Connect and subscribe to WebSocket topics
   */
  useEffect(() => {
    if (!enabled) return;

    let chatSubKey: string | null = null;
    let typingSubKey: string | null = null;

    const initWebSocket = async () => {
      try {
        // Connect if not connected
        if (!baseWebSocketService.isConnected()) {
          await baseWebSocketService.connect();
          console.log("[ChatWS] WebSocket connected");
        }

        // Subscribe to chat messages
        chatSubKey = chatWebSocketService.subscribeToChatMessages(
          transactionId,
          handleChatMessage
        );

        // Subscribe to typing indicator
        typingSubKey = chatWebSocketService.subscribeToTypingIndicator(
          transactionId,
          handleTypingIndicator
        );

        console.log(
          "[ChatWS] Subscribed to chat and typing for transaction:",
          transactionId
        );
      } catch (error) {
        console.error("[ChatWS] Failed to connect:", error);
      }
    };

    initWebSocket();

    return () => {
      if (chatSubKey) chatWebSocketService.unsubscribe(chatSubKey);
      if (typingSubKey) chatWebSocketService.unsubscribe(typingSubKey);
      console.log("[ChatWS] Unsubscribed from transaction:", transactionId);
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
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
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
