import api from "./api";
import type { User } from "@/features/auth/types";

interface PaginationParams {
  size?: number;
  page?: number;
  search?: string;
  sortBy?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    search?: string;
  };
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  hoVaTen?: string;
}

export interface UpdateUserRequest {
  password?: string;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  anhDaiDien?: string;
}

/**
 * User API endpoints - Aligned with backend UserController
 */
export const userAPI = {
  /**
   * GET /users - Get all users with pagination (admin only)
   */
  getAll: (params?: PaginationParams) =>
    api.get<PaginatedResponse<User>>("/users", { params }),

  /**
   * GET /users/me - Get current user profile
   */
  getMe: () => api.get<User>("/users/me"),

  /**
   * GET /users/{id} - Get user by ID
   */
  getById: (id: string) => api.get<User>(`/users/${id}`),

  /**
   * POST /users - Create new user (registration)
   */
  create: (data: CreateUserRequest) => api.post<User>("/users", data),

  /**
   * POST /users/request-seller - Request seller upgrade
   */
  requestSeller: () => api.post<void>("/users/request-seller"),

  /**
   * PUT /users/{id} - Update user
   */
  update: (id: string, data: UpdateUserRequest) =>
    api.put<User>(`/users/${id}`, data),

  /**
   * POST /users/{id}/reset-password - Reset user password (admin only)
   */
  resetPassword: (id: string) => api.post<void>(`/users/${id}/reset-password`),

  /**
   * DELETE /users/{id} - Delete user (admin only)
   */
  delete: (id: string) => api.delete<void>(`/users/${id}`),

  /**
   * POST /users/logout - Logout user
   */
  logout: () => api.post<void>("/users/logout"),
};
