import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenResponse,
} from "@/features/auth/types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
} as const;

/**
 * Auth API Client - Aligned with Backend API
 */
export const authAPI = {
  /**
   * Đăng nhập
   * Backend sẽ set refresh_token vào HTTP-only cookie
   */
  login: async (credentials: LoginRequest) => {
    const response = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    // response.data đã được unwrap bởi interceptor (lấy data.data)
    return response.data;
  },

  /**
   * Đăng ký tài khoản mới
   */
  register: async (userData: RegisterRequest) => {
    const response = await api.post<LoginResponse>("/auth/register", userData);
    return response.data;
  },

  /**
   * Đăng xuất - Xóa refresh_token cookie ở backend
   */
  logout: async () => {
    const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
  },

  /**
   * Refresh access token
   * Sử dụng refresh_token từ cookie (tự động gửi với withCredentials: true)
   * Backend không cần userId nữa, tự định danh từ cookie
   */
  refreshToken: async () => {
    const response = await api.post<RefreshTokenResponse>(
      AUTH_ENDPOINTS.REFRESH
    );
    return response.data;
  },

  // TODO: Implement these endpoints when backend is ready
  // forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  // resetPassword: (token: string, newPassword: string) => api.post("/auth/reset-password", { token, newPassword }),
  // getProfile: () => api.get("/auth/profile"),
  // verifyEmail: (token: string) => api.post("/auth/verify-email", { token }),
  // resendVerification: (email: string) => api.post("/auth/resend-verification", { email }),
};
