/**
 * WebSocket message types matching backend DTOs
 */

import type { TransactionStatus } from "./transaction";

export interface BidUpdateMessage {
  productId: number;
  giaHienTai: number;
  currentBidder: string;
  soLuotRaGia: number;
  thoiGianDat: string; // ISO date string from LocalDateTime
  eventType:
    | "NEW_BID"
    | "AUTO_BID"
    | "BUY_NOW"
    | "NEW_WINNER_FOUND"
    | "HISTORY_REMOVED"
    | "NO_BIDDER_LEFT";
  message: string;
}

export interface BidHistoryItemMessage {
  bidHistoryId: number;
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

export interface TransactionStatusMessage {
  transactionId: number;
  productId: number;
  tenSanPham: string;
  anhDaiDienSanPham?: string;
  buyerId: string;
  tenNguoiMua: string;
  sellerId: string;
  tenNguoiBan: string;
  gia: number;
  trangThai: TransactionStatus;
  diaChiGiaoHang?: string;
  maVanDon?: string;
  phuongThucThanhToan?: string;
  thoiGianThanhToan?: string;
  thoiGianGiaoHang?: string;
  thoiGianNhanHang?: string;
}

export type WebSocketEventType =
  | "NEW_BID"
  | "AUTO_BID"
  | "BUY_NOW"
  | "NEW_WINNER_FOUND"
  | "HISTORY_REMOVED"
  | "NO_BIDDER_LEFT";
