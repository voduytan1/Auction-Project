import api from "./api";
import type { ApiResponse } from "@/types/types";
import type { BidHistory } from "@/features/product-detail/types";

export interface PlaceBidData {
  productId: number;
  giaDat: number;
}

export interface AutoBidPayload {
  productid: number;
  giaToiDa: number;
}

export interface BuyNowResponse {
  success: boolean;
  message: string;
  bidHistory: {
    bidHistoryid: number;
    tenBidder: string;
    giaDat: number;
    thoiGianDat: string;
  };
  giaHienTai: number;
  soLuotRaGia: number | null;
  isExtended: boolean | null;
}

/**
 * Bid API endpoints
 * Handles all bidding operations: manual bids, auto-bids, buy now, bid history
 */
export const bidAPI = {
  /**
   * Place manual bid on product
   * POST /bids/{productId}
   */
  placeBid: (data: PlaceBidData) =>
    api.post<{ bid: BidHistory }>(`/bids/${data.productId}`, {
      giaDat: data.giaDat,
    }),

  /**
   * Buy now for a product
   * POST /bids/buy-now/{productId}
   */
  buyNow: (productId: number) =>
    api.post<BuyNowResponse>(`/bids/buy-now/${productId}`),

  /**
   * Create or update auto-bid for a product
   * POST /bids/auto
   */
  createAutoBid: (payload: AutoBidPayload) => api.post(`/bids/auto`, payload),

  /**
   * Get user's auto-bids
   * GET /bids/auto/my
   */
  getMyAutoBids: () => api.get(`/bids/auto/my`),

  /**
   * Delete auto-bid
   * DELETE /bids/auto/{autoBidId}
   */
  deleteAutoBid: (autoBidId: number) => api.delete(`/bids/auto/${autoBidId}`),

  /**
   * Get paginated bid history for product
   * GET /bids/history/{productId}?page=&size=
   */
  getBidHistory: (
    productId: number,
    params?: { page?: number; size?: number }
  ) =>
    api.get<ApiResponse<BidHistory[]>>(`/bids/history/${productId}`, {
      params,
    }),

  /**
   * Get top N bid history entries for a product
   * GET /bids/history/{productId}/get-top?number=5
   */
  getBidHistoryTop: (productId: number, numberOfItems = 5) =>
    api.get<ApiResponse<BidHistory[]>>(`/bids/history/${productId}/get-top`, {
      params: { number: numberOfItems },
    }),
};
