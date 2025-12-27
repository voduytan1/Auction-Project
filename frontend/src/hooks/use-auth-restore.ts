import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./use-redux";
import {
  refreshAccessToken,
  getUserMe,
  setInitializing,
} from "@/store/slices/authSlice";

/**
 * Hook để restore authentication state khi app khởi động (F5)
 *
 * Logic mới:
 * 1. Khi F5: Gọi refresh token (backend đọc từ cookie)
 * 2. Nếu refresh thành công:
 *    - Kiểm tra Redux có user chưa
 *    - Nếu chưa có user -> Gọi /users/me để lấy thông tin user
 * 3. Nếu refresh thất bại -> Clear auth state
 *
 * Không dùng localStorage nữa, toàn bộ lưu trong Redux
 */
export function useAuthRestore() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isInitializing } = useAppSelector(
    (state) => state.auth
  );
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    if (hasAttemptedRestore.current) {
      return;
    }

    const restoreSession = async () => {
      try {
        console.log("[Auth Restore] Starting session restore...");

        // Bước 1: Thử refresh token từ cookie
        const refreshResult = await dispatch(refreshAccessToken()).unwrap();
        console.log("[Auth Restore] Token refreshed successfully");

        // Bước 2: Kiểm tra xem đã có user chưa
        if (!user) {
          console.log(
            "[Auth Restore] No user in Redux, fetching from /users/me..."
          );
          await dispatch(getUserMe()).unwrap();
          console.log("[Auth Restore] User info fetched successfully");
        }

        console.log("[Auth Restore] Session restored successfully");
      } catch (error) {
        console.log("[Auth Restore] No valid session found:", error);
        // Không có session hoặc refresh thất bại -> Đơn giản set isInitializing = false
        dispatch(setInitializing(false));
      }
    };

    hasAttemptedRestore.current = true;
    restoreSession();
  }, [dispatch, user]);
}
