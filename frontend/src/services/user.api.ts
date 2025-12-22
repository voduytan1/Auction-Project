import api from "./api";
import type {
  MessageResponse,
  Transaction,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  Rating,
} from "@/types/types";

/**
 * User API endpoints
 * Includes user management, ratings, and transactions
 */
export const userAPI = {
  // ============= User Management =============
  /**
   * Get all users (admin only)
   */
  getAll: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get<{
      users: UserResponse[];
      total: number;
      page: number;
      limit: number;
    }>("/users", { params }),

  /**
   * Create new user (admin only)
   */
  create: (data: CreateUserRequest) =>
    api.post<{ user: UserResponse }>("/users", data),

  /**
   * Get user by ID
   */
  getById: (id: string) => api.get<{ user: UserResponse }>(`/users/${id}`),

  /**
   * Update user
   */
  update: (id: string, data: UpdateUserRequest) =>
    api.put<{ user: UserResponse }>(`/users/${id}`, data),

  /**
   * Delete user (admin only)
   */
  delete: (id: string) => api.delete(`/users/${id}`),

  /**
   * Update user profile (self)
   */
  updateProfile: (data: UpdateUserRequest) =>
    api.put<{ user: UserResponse }>("/users/profile", data),

  /**
   * Change password
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<MessageResponse>("/users/change-password", data),

  // ============= Bidder Upgrade =============
  /**
   * Request upgrade to Seller role
   */
  requestUpgrade: (lyDoYeuCau?: string) =>
    api.post<MessageResponse>("/users/request-upgrade", { lyDoYeuCau }),

  // ============= Rating Management =============
  /**
   * Get ratings for a user
   */
  getRatings: (userId: string) =>
    api.get<{
      ratings: Rating[];
      stats: { positive: number; negative: number; percentage: number };
    }>(`/users/${userId}/ratings`),

  /**
   * Rate a user (after transaction completion)
   */
  rateUser: (
    userId: string,
    diem: 1 | -1,
    productId: number,
    nhanXet?: string
  ) =>
    api.post<{ rating: Rating }>(`/users/${userId}/rate`, {
      diem,
      productId,
      nhanXet,
    }),

  // ============= Transaction Management =============
  /**
   * Get all transactions for current user
   */
  getMyTransactions: (params?: { status?: string }) =>
    api.get<{ transactions: Transaction[] }>("/me/transactions", { params }),

  /**
   * Get transaction by ID
   */
  getTransactionById: (transactionId: number) =>
    api.get<{ transaction: Transaction }>(`/transactions/${transactionId}`),

  /**
   * Update transaction status
   */
  updateTransactionStatus: (
    transactionId: number,
    status: string,
    data?: Partial<Transaction>
  ) =>
    api.put<{ transaction: Transaction }>(
      `/transactions/${transactionId}/status`,
      { status, ...data }
    ),
};
