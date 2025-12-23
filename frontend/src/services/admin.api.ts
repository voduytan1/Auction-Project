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
};
