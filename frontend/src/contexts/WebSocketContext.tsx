import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { webSocketService } from "@/services/websocket";
import { useAppSelector } from "@/hooks/use-redux";

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);
  const isConnecting = useRef(false);

  const connect = useCallback(async () => {
    if (isConnecting.current || webSocketService.isConnected()) return;

    isConnecting.current = true;
    try {
      await webSocketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error("[WebSocketProvider] Connection error:", error);
      setIsConnected(false);
    } finally {
      isConnecting.current = false;
    }
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  // Auto connect when authenticated
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      connect();
    } else if (!isAuthenticated && isConnected) {
      disconnect();
    }
  }, [isAuthenticated, isConnected, connect, disconnect]);

  return (
    <WebSocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within WebSocketProvider"
    );
  }
  return context;
}
