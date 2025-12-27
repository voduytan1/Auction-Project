import api from "./api";
import type { Transaction } from "@/types/transaction";
import type { ApiResponse } from "@/types/types";

export interface TransactionQueryParams {
  page?: number;
  size?: number;
  search?: string;
}

/**
 * Transaction API Service
 * Quản lý giao dịch mua/bán
 */
export const transactionAPI = {
  /**
   * Lấy danh sách giao dịch MUA của user hiện tại
   */
  getBuyerTransactions: (params?: TransactionQueryParams) =>
    api.get<ApiResponse<Transaction[]>>("/transactions/buyer", { params }),

  /**
   * Lấy danh sách giao dịch BÁN của user hiện tại
   */
  getSellerTransactions: (params?: TransactionQueryParams) =>
    api.get<ApiResponse<Transaction[]>>("/transactions/seller", { params }),

  /**
   * Lấy chi tiết 1 giao dịch
   */
  getTransactionById: (id: number) =>
    api.get<Transaction>(`/transactions/${id}`),

  /**
   * Thêm địa chỉ giao hàng (Buyer only)
   * Chuyển trạng thái từ PAYMENT_COMPLETED → AWAITING_SHIPMENT
   */
  addAddress: (id: number, diaChiGiaoHang: string) =>
    api.post<Transaction>(`/transactions/${id}/dia-chi`, { diaChiGiaoHang }),

  /**
   * Thêm mã vận đơn (Seller only)
   * Chuyển trạng thái từ AWAITING_SHIPMENT → SHIPPED
   */
  addShipmentProve: (id: number, maVanDon: string) =>
    api.post<Transaction>(`/transactions/${id}/ma-van-don`, { maVanDon }),

  /**
   * Xác nhận hoàn thành giao dịch (Buyer only)
   * Chuyển trạng thái từ SHIPPED → COMPLETED
   */
  completeTransaction: (id: number) =>
    api.post<Transaction>(`/transactions/${id}/hoan-thanh`),

  /**
   * Hủy giao dịch (Seller only, chỉ khi PENDING_PAYMENT)
   * Chuyển trạng thái → CANCELLED + tự động -1 điểm cho buyer
   */
  cancelTransaction: (id: number) =>
    api.post<Transaction>(`/transactions/${id}/huy`),
};
