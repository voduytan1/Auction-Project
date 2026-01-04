import api from "./api";

/**
 * Admin DTOs matching backend AdminController
 */
export interface UpgradeRequestResponse {
  requestid: number;
  userid: string;
  username: string;
  trangThai: "PENDING" | "APPROVED" | "REJECTED";
  lyDo?: string;
  approvedByAdmin?: string;
  ghiChuAdmin?: string;
}

interface PaginationParams {
  size?: number;
  page?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  content?: T[]; // For backward compatibility
  data?: T[]; // Backend uses 'data'
  metadata?: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  };
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    search?: string;
  };
}

/**
 * Admin API endpoints - Aligned with backend AdminController
 */
export const adminAPI = {
  /**
   * GET /admin/request - Get all upgrade requests with pagination
   * Query params: size, page, search (username search)
   */
  getAllRequests: (params?: PaginationParams) =>
    api.get<PaginatedResponse<UpgradeRequestResponse>>("/admin/request", {
      params,
    }),

  /**
   * GET /admin/request/pending - Get pending upgrade requests
   * Query params: size, page, search (username search)
   */
  getPendingRequests: (params?: PaginationParams) =>
    api.get<PaginatedResponse<UpgradeRequestResponse>>(
      "/admin/request/pending",
      { params }
    ),

  /**
   * POST /admin/requests/{id} - Approve or reject upgrade request
   * Body: { approve: boolean }
   */
  processRequest: (id: number, approve: boolean) =>
    api.post<void>(`/admin/requests/${id}`, { approve }),

  /**
   * GET /admin/config/{variable} - Get config value
   */
  getConfig: (variable: string) =>
    api.get<{ variable: string; value: number | string }>(
      `/admin/config/${variable}`
    ),

  /**
   * POST /admin/config - Update config value
   * Body: { variable: string, value: number | string }
   */
  updateConfig: (data: { variable: string; value: number | string }) =>
    api.post<{ variable: string; value: number | string }>(
      `/admin/config`,
      data
    ),

  // Dashboard endpoints
  /**
   * GET /admin/dashboard/upgrade-request/today - Get today's upgrade request chart
   */
  getUpgradeRequestToday: () =>
    api.get<{
      pending: number;
      approved: number;
      rejected: number;
      total: number;
    }>("/admin/dashboard/upgrade-request/today"),

  /**
   * GET /admin/dashboard/upgrade-request/this-week - Get this week's upgrade request chart
   */
  getUpgradeRequestWeek: () =>
    api.get<{
      pending: number;
      approved: number;
      rejected: number;
      total: number;
    }>("/admin/dashboard/upgrade-request/this-week"),

  /**
   * GET /admin/dashboard/upgrade-request/this-month - Get this month's upgrade request chart
   */
  getUpgradeRequestMonth: () =>
    api.get<{
      pending: number;
      approved: number;
      rejected: number;
      total: number;
    }>("/admin/dashboard/upgrade-request/this-month"),

  /**
   * GET /admin/dashboard/revenue/this-year - Get monthly revenue chart for this year
   */
  getRevenueThisYear: () =>
    api.get<Array<{ month: number; revenue: number }>>(
      "/admin/dashboard/revenue/this-year"
    ),

  /**
   * GET /admin/dashboard/new-user/this-year - Get monthly new user chart for this year
   */
  getNewUserThisYear: () =>
    api.get<Array<{ month: number; bidder: number; seller: number }>>(
      "/admin/dashboard/new-user/this-year"
    ),

  /**
   * GET /admin/dashboard/product/this-year - Get monthly product chart for this year
   */
  getProductThisYear: () =>
    api.get<
      Array<{ month: number; newProduct: number; completedProduct: number }>
    >("/admin/dashboard/product/this-year"),

  /**
   * GET /admin/dashboard/categories - Get category distribution chart
   */
  getCategoryDistribution: () =>
    api.get<
      Array<{ categoryId: number; tenDanhMuc: string; soLuongSanPham: number }>
    >("/admin/dashboard/categories"),

  /**
   * GET /admin/dashboard/stat - Get overall website statistics
   */
  getWebStats: () =>
    api.get<{
      usersCount: number;
      userGrowth: number;
      auctionsCount: number;
      newAuctionsCount: number;
      bidsCount: number;
      newBidsCount: number;
      revenue: number;
      revenueGrowth: number;
    }>("/admin/dashboard/stat"),

  /**
   * GET /admin/dashboard/top-auctions - Get top 3 auctions by price
   */
  getTopAuctions: () =>
    api.get<
      Array<{ tenSanPham: string; giaHienTai: number; soLuotRaGia: number }>
    >("/admin/dashboard/top-auctions"),
};
