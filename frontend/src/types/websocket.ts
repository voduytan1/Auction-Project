/**
 * WebSocket message types matching backend DTOs
 */

export interface BidUpdateMessage {
  productId: number;
  giaHienTai: number;
  currentBidder: string;
  soLuotRaGia: number;
  thoiGianDat: string; // ISO date string from LocalDateTime
  eventType: "NEW_BID" | "AUTO_BID" | "BUY_NOW";
  message: string;
}

export interface BidHistoryItemMessage {
  bidHistoryid: number;
  productId: number;
  bidderName: string;
  giaDat: number;
  thoiGianDat: string; // ISO date string from LocalDateTime
}

export interface ProductStatusMessage {
  productId: number;
  status: string; // ACTIVE, COMPLETED, CANCELLED, etc.
  message: string;
  winnerId?: string;
  winnerName?: string;
}

export type WebSocketEventType = "NEW_BID" | "AUTO_BID" | "BUY_NOW";
