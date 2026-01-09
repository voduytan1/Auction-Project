import { useEffect, useRef } from "react";
import { useAppDispatch } from "./use-redux";
import { refreshAccessToken, setInitializing } from "@/store/slices/authSlice";

/**
 * Hook để restore authentication state khi app khởi động (F5)
 *
 * Logic đơn giản:
 * 1. Khi F5: Luôn thử gọi refresh token (backend tự check cookie)
 * 2. Nếu refresh thành công → Set user + accessToken
 * 3. Nếu refresh thất bại (401) → User chưa đăng nhập
 *
 * API /auth/refresh đã trả về đầy đủ thông tin user, không cần gọi /user/me
 */
export function useAuthRestore() {
  const dispatch = useAppDispatch();
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    if (hasAttemptedRestore.current) {
      return;
    }
    hasAttemptedRestore.current = true;

    const restoreSession = async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap();
        // authSlice.refreshAccessToken.fulfilled đã set user + isAuthenticated + isInitializing = false
      } catch {
        // Refresh thất bại (401): Không có user
        dispatch(setInitializing(false));
      }
    };

    restoreSession();
  }, [dispatch]);
}
