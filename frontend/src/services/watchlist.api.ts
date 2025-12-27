import api from "./api";
import type { ApiResponse } from "@/types/types";

/**
 * Watchlist API - Danh sách yêu thích
 */
export interface WatchlistResponse {
  watchlistId: number;
  productId: number;
  tenSanPham: string;
  userId: string;
}

export const watchlistAPI = {
  /**
   * GET /theo-doi - Get user's watchlist (product IDs only)
   */
  getWatchlist: () => api.get<ApiResponse<number[]>>("/theo-doi"),

  /**
   * POST /theo-doi - Add product to watchlist
   */
  addToWatchlist: (productId: number) =>
    api.post<ApiResponse<WatchlistResponse>>("/theo-doi", { productId }),

  /**
   * DELETE /theo-doi - Remove product from watchlist
   */
  removeFromWatchlist: (productId: number) =>
    api.delete<ApiResponse<void>>("/theo-doi", { data: { productId } }),
};
