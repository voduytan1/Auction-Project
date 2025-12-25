import api from "./api";
import type { Transaction } from "@/types/transaction";
import type { ApiResponse, PaginatedResponse } from "@/types/types";

export interface TransactionQueryParams {
  page?: number;
  size?: number;
  search?: string;
}

/**
 * Transaction API Service
 * Quáº£n lÃ½ giao dá»‹ch mua/bÃ¡n
 */
export const transactionAPI = {
  /**
   * Láº¥y danh sÃ¡ch giao dá»‹ch MUA cá»§a user hiá»‡n táº¡i
   */
  getBuyerTransactions: async (
    params?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>(
      "/transactions/buyer",
      { params }
    );
    return response.data;
  },

  /**
   * Láº¥y danh sÃ¡ch giao dá»‹ch BÃN cá»§a user hiá»‡n táº¡i
   */
  getSellerTransactions: async (
    params?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>(
      "/transactions/seller",
      { params }
    );
    return response.data;
  },

  /**
   * Láº¥y chi tiáº¿t 1 giao dá»‹ch
   */
  getTransactionById: async (id: number): Promise<Transaction> => {
    const response = await api.get<ApiResponse<Transaction>>(
      `/transactions/${id}`
    );
    return response.data.data!;
  },
};
