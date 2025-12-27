import { useCallback } from "react";
import { useWebSocket } from "./use-websocket";
import type {
  BidUpdateMessage,
  BidHistoryItemMessage,
  ProductStatusMessage,
} from "@/types/websocket";

interface UseBidWebSocketOptions {
  productId?: number;
  onBidUpdate?: (message: BidUpdateMessage) => void;
  onBidHistory?: (messages: BidHistoryItemMessage[]) => void;
  onProductStatus?: (message: ProductStatusMessage) => void;
  enabled?: boolean;
}

/**
 * Custom hook for monitoring product bid updates via WebSocket
 */
export function useBidWebSocket({
  productId,
  onBidUpdate,
  onBidHistory,
  onProductStatus,
  enabled = true,
}: UseBidWebSocketOptions) {
  return useWebSocket({
    productId,
    onBidUpdate: useCallback(
      (message: BidUpdateMessage) => {
        onBidUpdate?.(message);
      },
      [onBidUpdate]
    ),
    onBidHistory: useCallback(
      (messages: BidHistoryItemMessage[]) => {
        onBidHistory?.(messages);
      },
      [onBidHistory]
    ),
    onProductStatus: useCallback(
      (message: ProductStatusMessage) => {
        onProductStatus?.(message);
      },
      [onProductStatus]
    ),
    enabled: enabled && (productId ? true : false),
  });
}
