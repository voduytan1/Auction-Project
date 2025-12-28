import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenResponse,
  User,
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
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials),

  /**
   * Đăng ký tài khoản mới
   * POST /users - role mặc định là BIDDER
   */
  register: (userData: RegisterRequest) =>
    api.post<User>("/users", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      vaitro: "BIDDER",
      hoVaTen: userData.hoVaTen,
      captchaToken: userData.captchaToken, // reCAPTCHA v3 token for backend verification
    }),

  /**
   * Đăng xuất - Xóa refresh_token cookie ở backend
   */
  logout: () => api.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT),

  /**
   * Refresh access token
   * Sử dụng refresh_token từ cookie (tự động gửi với withCredentials: true)
   * Backend không cần userId nữa, tự định danh từ cookie
   */
  refreshToken: () => api.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH),

  // TODO: Implement these endpoints when backend is ready
  // forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  // resetPassword: (token: string, newPassword: string) => api.post("/auth/reset-password", { token, newPassword }),
  // getProfile: () => api.get("/auth/profile"),
  // verifyEmail: (token: string) => api.post("/auth/verify-email", { token }),
  // resendVerification: (email: string) => api.post("/auth/resend-verification", { email }),
};
