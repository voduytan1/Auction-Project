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
   * Gửi mã OTP qua email
   * POST /auth/send-otp?email=...
   */
  sendOtp: (email: string) =>
    api.post<{ message: string }>("/auth/send-otp", null, {
      params: { email },
    }),

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
      recaptchaToken: userData.recaptchaToken, // reCAPTCHA v3 token for backend verification
      OTP: userData.otp, // OTP code from email - backend expects "OTP" not "otp"
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

  /**
   * Forgot password - Reset password with OTP and recaptcha
   * PATCH /auth/forgot-password
   */
  forgotPassword: (
    email: string,
    otp: string,
    password: string,
    recaptchaToken: string
  ) =>
    api.patch<LoginResponse>("/auth/forgot-password", {
      email,
      OTP: otp,
      password,
      recaptchaToken,
    }),
};
