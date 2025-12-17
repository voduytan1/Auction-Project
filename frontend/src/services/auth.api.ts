import api from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  MessageResponse,
  RegisterData,
  User,
} from "@/types/types";

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Login user
   */
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>("/auth/login", credentials),

  /**
   * Register new user
   */
  register: (userData: RegisterData) =>
    api.post<MessageResponse>("/auth/register", userData),

  /**
   * Logout user
   */
  logout: () => api.post("/auth/logout"),

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      refreshToken,
    }),

  /**
   * Forgot password
   */
  forgotPassword: (email: string) =>
    api.post<MessageResponse>("/auth/forgot-password", { email }),

  /**
   * Reset password
   */
  resetPassword: (token: string, newPassword: string) =>
    api.post<MessageResponse>("/auth/reset-password", {
      token,
      newPassword,
    }),

  /**
   * Get current user profile
   */
  getProfile: () => api.get<{ user: User }>("/auth/profile"),

  /**
   * Verify email
   */
  verifyEmail: (token: string) =>
    api.post<MessageResponse>("/auth/verify-email", { token }),

  /**
   * Resend verification email
   */
  resendVerification: (email: string) =>
    api.post<MessageResponse>("/auth/resend-verification", { email }),
};
