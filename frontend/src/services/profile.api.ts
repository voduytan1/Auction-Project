import api from "./api";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  UserRating,
  RatingStats,
} from "@/features/profile/types";

/**
 * Profile API endpoints
 */
export const profileAPI = {
  /**
   * Get current user profile
   */
  getMe: async () => {
    const response = await api.get<UserProfile>("/profile/me");
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put<UserProfile>("/profile/me", data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post<{ message: string }>(
      "/profile/change-password",
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }
    );
    return response.data;
  },

  /**
   * Get user ratings
   */
  getMyRatings: async () => {
    const response = await api.get<{
      ratings: UserRating[];
      stats: RatingStats;
    }>("/profile/me/ratings");
    return response.data;
  },

  /**
   * Request forgot password (send OTP via email)
   */
  requestForgotPassword: async (email: string) => {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  /**
   * Verify OTP and reset password
   */
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      {
        email,
        otp,
        newPassword,
      }
    );
    return response.data;
  },

  /**
   * Request upgrade to seller
   */
  requestUpgradeToSeller: async () => {
    const response = await api.post<{ message: string }>(
      "/profile/request-seller"
    );
    return response.data;
  },
};
