import api from "./api";
import type { LoginResponse } from "@/features/auth/types";

/**
 * OAuth API - Token Exchange với Backend
 * Flow: Frontend lấy credential từ Google → Gửi xuống Backend verify → Nhận JWT của hệ thống
 */

export const oauthAPI = {
  /**
   * POST /auth/google - Đăng nhập với Google
   * Response giống LoginResponse
   */
  loginWithGoogle: (credential: string) =>
    api.post<LoginResponse>("/auth/google", {
      token: credential,
    }),
};
