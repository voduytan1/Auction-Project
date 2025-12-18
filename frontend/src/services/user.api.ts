import api from "./api";
import type {
  MessageResponse,
  Order,
  PasswordChangeData,
  User,
  UserRating,
  UserStats,
  UserUpdateData,
} from "@/types/types";

/**
 * User API endpoints
 * Includes bidder/seller upgrade and rating management
 */
export const userAPI = {
  // ============= User Management =============
  /**
   * Get all users (admin only)
   */
  getAll: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get<{ users: User[]; total: number; page: number; limit: number }>(
      "/users",
      { params }
    ),

  /**
   * Get user by ID
   */
  getById: (id: string) => api.get<{ user: User }>(`/users/${id}`),

  /**
   * Update user
   */
  update: (id: string, data: UserUpdateData) =>
    api.put<{ user: User }>(`/users/${id}`, data),

  /**
   * Delete user (admin only)
   */
  delete: (id: string) => api.delete(`/users/${id}`),

  /**
   * Update user profile (self)
   */
  updateProfile: (data: UserUpdateData) =>
    api.put<{ user: User }>("/users/profile", data),

  /**
   * Change password
   */
  changePassword: (data: PasswordChangeData) =>
    api.post<MessageResponse>("/users/change-password", data),

  /**
   * Get user statistics (admin only)
   */
  getStats: () => api.get<UserStats>("/users/stats"),

  // ============= Bidder Upgrade =============
  /**
   * Request upgrade to Seller role
   */
  requestUpgrade: () => api.post<MessageResponse>("/users/request-upgrade"),

  // ============= Rating Management =============
  /**
   * Get ratings for a user
   */
  getRatings: (userId: string) =>
    api.get<{
      ratings: UserRating[];
      stats: { positive: number; negative: number; percentage: number };
    }>(`/users/${userId}/ratings`),

  /**
   * Rate a user (after order completion)
   */
  rateUser: (userId: string, type: "like" | "dislike", orderId: string) =>
    api.post<{ rating: UserRating }>(`/users/${userId}/rate`, {
      type,
      orderId,
    }),

  // ============= Order Management =============
  /**
   * Get all orders for current user
   */
  getMyOrders: (params?: { status?: string }) =>
    api.get<{ orders: Order[] }>("/me/orders", { params }),

  /**
   * Get order by ID
   */
  getOrderById: (orderId: string) =>
    api.get<{ order: Order }>(`/orders/${orderId}`),

  /**
   * Update order status (seller only)
   */
  updateOrderStatus: (
    orderId: string,
    status: "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled"
  ) => api.put<{ order: Order }>(`/orders/${orderId}/status`, { status }),

  /**
   * Confirm payment received (seller)
   */
  confirmPayment: (orderId: string) =>
    api.post<{ order: Order }>(`/orders/${orderId}/confirm-payment`),

  /**
   * Mark order as shipped (seller)
   */
  shipOrder: (orderId: string, trackingNumber?: string) =>
    api.post<{ order: Order }>(`/orders/${orderId}/ship`, {
      trackingNumber,
    }),

  /**
   * Confirm delivery (bidder)
   */
  confirmDelivery: (orderId: string) =>
    api.post<{ order: Order }>(`/orders/${orderId}/confirm-delivery`),

  /**
   * Cancel order
   */
  cancelOrder: (orderId: string, reason: string) =>
    api.post<{ order: Order }>(`/orders/${orderId}/cancel`, { reason }),
};
