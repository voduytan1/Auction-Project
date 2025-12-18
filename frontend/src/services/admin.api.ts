import api from "./api";
import type { DashboardStats, User } from "@/types/types";

/**
 * Admin-specific API endpoints
 */
export const adminAPI = {
  // ============= Dashboard =============
  /**
   * Get admin dashboard statistics
   */
  getDashboard: () => api.get<DashboardStats>("/admin/dashboard"),

  // ============= User Management =============
  /**
   * Get all users
   */
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => api.get("/admin/users", { params }),

  /**
   * Get upgrade requests
   */
  getUpgradeRequests: (params?: { status?: string }) =>
    api.get<{ users: User[] }>("/admin/upgrade-requests", { params }),

  /**
   * Approve upgrade request
   */
  approveUpgrade: (userId: string) =>
    api.post(`/admin/users/${userId}/approve-upgrade`),

  /**
   * Reject upgrade request
   */
  rejectUpgrade: (userId: string, reason?: string) =>
    api.post(`/admin/users/${userId}/reject-upgrade`, { reason }),

  /**
   * Delete user (admin only)
   */
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  // ============= Auction Management =============
  /**
   * Get all auctions (admin view)
   */
  getAllAuctions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get("/admin/auctions", { params }),

  /**
   * Remove auction
   */
  removeAuction: (auctionId: string) =>
    api.delete(`/admin/auctions/${auctionId}`),

  // ============= System Settings =============
  /**
   * Get system settings
   */
  getSettings: () =>
    api.get<{
      autoExtendTrigger: number;
      autoExtendDuration: number;
      newProductMinutes: number;
    }>("/admin/settings"),

  /**
   * Update system settings
   */
  updateSettings: (data: {
    autoExtendTrigger?: number;
    autoExtendDuration?: number;
    newProductMinutes?: number;
  }) => api.put("/admin/settings", data),
};
