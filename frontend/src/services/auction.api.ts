import api from "./api";
import type {
  Auction,
  AuctionCreateData,
  AuctionSearchParams,
  AuctionStats,
  AuctionUpdateData,
  AuctionQuestion,
  Bid,
  Category,
  PlaceBidData,
  WatchlistItem,
} from "@/types/types";

/**
 * Auction API endpoints
 * Consolidated from auction, category, question, bidder, seller APIs
 */
export const auctionAPI = {
  // ============= Categories =============
  getAllCategories: () => api.get<{ categories: Category[] }>("/categories"),

  getCategoryById: (id: string) =>
    api.get<{ category: Category }>(`/categories/${id}`),

  // ============= Public Browse =============
  /**
   * Get all auctions with filters
   * Full-text search support for Vietnamese (unaccented)
   */
  getAll: (params?: AuctionSearchParams) =>
    api.get<{
      auctions: Auction[];
      total: number;
      page: number;
      limit: number;
    }>("/auctions", { params }),

  /**
   * Search auctions by keyword
   * Supports Vietnamese full-text search
   */
  search: (params: {
    keyword?: string;
    categoryId?: string;
    sortBy?: "endDate" | "price" | "newest";
    page?: number;
    limit?: number;
  }) => api.get("/auctions/search", { params }),

  /**
   * Get auction by ID (with full details)
   */
  getById: (id: string) => api.get<{ auction: Auction }>(`/auctions/${id}`),

  /**
   * Get auctions by category
   */
  getByCategory: (
    categoryId: string,
    params?: { page?: number; limit?: number }
  ) => api.get(`/auctions/category/${categoryId}`, { params }),

  // ============= Homepage Featured =============
  /**
   * Top 5 ending soon auctions
   */
  getEndingSoon: () =>
    api.get<{ auctions: Auction[] }>("/auctions/ending-soon"),

  /**
   * Top 5 most bid auctions
   */
  getMostBids: () => api.get<{ auctions: Auction[] }>("/auctions/most-bids"),

  /**
   * Top 5 highest price auctions
   */
  getHighestPrice: () =>
    api.get<{ auctions: Auction[] }>("/auctions/highest-price"),

  /**
   * Get 5 related auctions (same category)
   */
  getRelated: (auctionId: string) =>
    api.get<{ auctions: Auction[] }>(`/auctions/${auctionId}/related`),

  // ============= Bidding =============
  /**
   * Place bid on auction
   * Supports both normal and auto-bidding
   */
  placeBid: (data: PlaceBidData) =>
    api.post<{ bid: Bid }>(`/auctions/${data.auctionId}/bids`, data),

  /**
   * Get bid history for auction
   * Bidder info is partially masked for privacy
   */
  getBidHistory: (auctionId: string) =>
    api.get<{ bids: Bid[] }>(`/auctions/${auctionId}/bids`),

  // ============= Watchlist =============
  /**
   * Get user's watchlist
   */
  getWatchlist: () => api.get<{ watchlist: WatchlistItem[] }>("/me/watchlist"),

  /**
   * Add auction to watchlist
   */
  addToWatchlist: (auctionId: string) =>
    api.post<{ watchlist: WatchlistItem }>("/me/watchlist", { auctionId }),

  /**
   * Remove auction from watchlist
   */
  removeFromWatchlist: (auctionId: string) =>
    api.delete(`/me/watchlist/${auctionId}`),

  // ============= Questions =============
  /**
   * Get all questions for an auction
   */
  getQuestions: (auctionId: string) =>
    api.get<{ questions: AuctionQuestion[] }>(
      `/auctions/${auctionId}/questions`
    ),

  /**
   * Ask question about auction (bidders)
   */
  askQuestion: (auctionId: string, question: string) =>
    api.post<{ question: AuctionQuestion }>(
      `/auctions/${auctionId}/questions`,
      { question }
    ),

  /**
   * Answer question (seller only)
   */
  answerQuestion: (questionId: string, answer: string) =>
    api.put<{ question: AuctionQuestion }>(`/questions/${questionId}`, {
      answer,
    }),

  // ============= Seller Operations =============
  /**
   * Create new auction
   */
  createAuction: (data: AuctionCreateData) =>
    api.post<{ auction: Auction }>("/auctions", data),

  /**
   * Update auction (before first bid)
   */
  updateAuction: (id: string, data: AuctionUpdateData) =>
    api.put<{ auction: Auction }>(`/auctions/${id}`, data),

  /**
   * Append to auction description (after first bid)
   * Maintains history of changes
   */
  appendDescription: (id: string, content: string) =>
    api.post<{ auction: Auction }>(`/auctions/${id}/description`, {
      content,
    }),

  /**
   * Reject bidder from auction
   * Prevents future bids from this bidder
   */
  rejectBidder: (auctionId: string, bidderId: string) =>
    api.post(`/auctions/${auctionId}/reject-bidder`, { bidderId }),

  // ============= My Auctions =============
  /**
   * Get auctions I'm selling
   */
  getMyAuctions: (params?: { status?: string }) =>
    api.get<{ auctions: Auction[] }>("/me/auctions", { params }),

  /**
   * Get auctions I'm bidding on
   */
  getMyBids: (params?: { status?: string }) =>
    api.get<{ bids: Bid[] }>("/me/bids", { params }),

  /**
   * Get auctions I won
   */
  getMyWonAuctions: () => api.get<{ auctions: Auction[] }>("/me/auctions/won"),

  // ============= Statistics =============
  /**
   * Get auction statistics
   */
  getStats: () => api.get<AuctionStats>("/auctions/stats"),
};
