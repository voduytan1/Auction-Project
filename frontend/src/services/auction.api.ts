import api from "./api";
import type {
  Product,
  ProductDisplay,
  ProductSearchParams,
  PlaceBidData,
  WatchList,
  ProductQuestion,
  ApiResponse,
} from "@/types/types";
import type { BidHistory } from "@/features/product-detail/types";

/**
 * Product/Auction API endpoints
 * Consolidated from product, bid, watchlist, question APIs
 */
export const auctionAPI = {
  // ============= Public Browse =============
  /**
   * Get all products with filters
   */
  getAll: (params?: ProductSearchParams) =>
    api.get<{
      products: ProductDisplay[];
      total: number;
      page: number;
      limit: number;
    }>("/products", { params }),

  /**
   * Search products by keyword
   */
  search: (params: {
    keyword?: string;
    categoryId?: string;
    sortBy?: "thoiGianKetThuc" | "giaHienTai" | "createdAt";
    page?: number;
    limit?: number;
  }) => api.get("/products/search", { params }),

  /**
   * Get product by ID (with full details)
   */
  getById: (id: number) =>
    api.get<{ product: ProductDisplay }>(`/products/${id}`),

  /**
   * Get products by category
   */
  getByCategory: (
    categoryId: string,
    params?: { page?: number; limit?: number }
  ) => api.get(`/products/category/${categoryId}`, { params }),

  // ============= Homepage Featured =============
  /**
   * Top 5 ending soon products
   */
  getEndingSoon: () =>
    api.get<{ products: ProductDisplay[] }>("/products/ending-soon"),

  /**
   * Top 5 most bid products
   */
  getMostBids: () =>
    api.get<{ products: ProductDisplay[] }>("/products/most-bids"),

  /**
   * Top 5 highest price products
   */
  getHighestPrice: () =>
    api.get<{ products: ProductDisplay[] }>("/products/highest-price"),

  /**
   * Get 5 related products (same category)
   */
  getRelated: (productId: number) =>
    api.get<{ products: ProductDisplay[] }>(`/products/${productId}/related`),

  // ============= Bidding =============
  /**
   * Place bid on product
   */
  placeBid: (data: PlaceBidData) =>
    api.post<{ bid: BidHistory }>(`/products/${data.productId}/bids`, data),

  /**
   * Buy now for a product
   * Backend endpoint: POST /bids/buy-now/{productId}
   * Response structure:
   * {
   *   success: true,
   *   message: "Mua ngay thành công",
   *   bidHistory: { bidHistoryid, tenBidder, giaDat, thoiGianDat },
   *   giaHienTai: number,
   *   soLuotRaGia: number | null,
   *   isExtended: boolean | null
   * }
   */
  buyNow: (productId: number) =>
    api.post<{
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
    }>(`/bids/buy-now/${productId}`),

  /**
   * Create or update auto-bid for a product
   * POST /bids/auto { productid, giaToiDa }
   */
  createAutoBid: (payload: { productid: number; giaToiDa: number }) =>
    api.post(`/bids/auto`, payload),

  /**
   * Get bid history for product
   */
  getBidHistory: (productId: number) =>
    api.get<{ bids: BidHistory[] }>(`/products/${productId}/bids`),

  /**
   * Get paginated bid history for product
   * Backend endpoint: GET /bids/history/{productId}?page=&size=
   */
  getBidHistoryPaged: (
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

  // ============= Watchlist =============
  /**
   * Get user's watchlist
   */
  getWatchlist: () => api.get<{ items: WatchList[] }>("/watchlist"),

  /**
   * Add product to watchlist
   */
  addToWatchlist: (productId: number) =>
    api.post<{ watchlist: WatchList }>("/watchlist", { productId }),

  /**
   * Remove product from watchlist
   */
  removeFromWatchlist: (productId: number) =>
    api.delete(`/watchlist/${productId}`),

  // ============= Questions =============
  /**
   * Get all questions for a product
   */
  getQuestions: (productId: number) =>
    api.get<{ questions: ProductQuestion[] }>(
      `/products/${productId}/questions`
    ),

  /**
   * Ask a question about a product
   */
  askQuestion: (productId: number, question: string) =>
    api.post<{ question: ProductQuestion }>(
      `/products/${productId}/questions`,
      { question }
    ),

  /**
   * Answer question (seller only)
   */
  answerQuestion: (questionId: number, answer: string) =>
    api.put<{ question: ProductQuestion }>(`/questions/${questionId}`, {
      answer,
    }),

  // ============= Seller Operations =============
  /**
   * Create new product
   */
  createProduct: (data: Partial<Product>) =>
    api.post<{ product: ProductDisplay }>("/products", data),

  /**
   * Update product (before first bid)
   */
  updateProduct: (id: number, data: Partial<Product>) =>
    api.put<{ product: ProductDisplay }>(`/products/${id}`, data),

  /**
   * Delete product
   */
  deleteProduct: (id: number) => api.delete(`/products/${id}`),

  /**
   * Get seller's products
   */
  getSellerProducts: () =>
    api.get<{ products: ProductDisplay[] }>("/me/products"),

  /**
   * Reject bidder from product
   */
  rejectBidder: (productId: number, bidderId: string) =>
    api.post(`/products/${productId}/reject-bidder`, { bidderId }),

  // ============= Stats =============
  /**
   * Get product statistics (Admin only)
   */
  getStats: () =>
    api.get<{ totalProducts: number; activeProducts: number }>(
      "/products/stats"
    ),
};
