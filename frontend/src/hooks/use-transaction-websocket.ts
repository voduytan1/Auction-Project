import { useCallback } from "react";
import { useWebSocket } from "./use-websocket";
import type { TransactionStatusMessage } from "@/types/websocket";

interface UseTransactionWebSocketOptions {
  transactionId?: number;
  onStatusChange?: (message: TransactionStatusMessage) => void;
  enabled?: boolean;
}

/**
 * Custom hook for monitoring transaction status changes via WebSocket
 */
export function useTransactionWebSocket({
  transactionId,
  onStatusChange,
  enabled = true,
}: UseTransactionWebSocketOptions) {
  return useWebSocket({
    transactionId,
    onTransactionStatus: useCallback(
      (message: TransactionStatusMessage) => {
        onStatusChange?.(message);
      },
      [onStatusChange]
    ),
    enabled: enabled && (transactionId ? true : false),
  });
}
