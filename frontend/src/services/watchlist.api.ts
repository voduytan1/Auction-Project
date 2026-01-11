import api from "./api";
import type { ProductResponse } from "./product.api";

/**
 * Watchlist API - Danh sách yêu thích
 */
export interface WatchlistResponse {
  watchlistId: number;
  userId: string;
  product: ProductResponse;
}

export const watchlistAPI = {
  /**
   * GET /theo-doi - Get user's watchlist (product IDs only)
   * Note: Axios interceptor unwraps ApiResponse, so returns number[] directly
   */
  getWatchlist: () => api.get<number[]>("/theo-doi"),

  /**
   * GET /theo-doi/list - Get user's watchlist with full product details
   * Note: Axios interceptor unwraps ApiResponse, so returns WatchlistResponse[] directly
   */
  getWatchlistWithProducts: (params?: { page?: number; size?: number }) =>
    api.get<WatchlistResponse[]>("/theo-doi/list", { params }),

  /**
   * POST /theo-doi - Add product to watchlist
   */
  addToWatchlist: (productId: number) =>
    api.post<WatchlistResponse>("/theo-doi", { productId }),

  /**
   * DELETE /theo-doi - Remove product from watchlist
   */
  removeFromWatchlist: (productId: number) =>
    api.delete<void>("/theo-doi", { data: { productId } }),
};
