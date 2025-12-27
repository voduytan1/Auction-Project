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
  const { user } = useAppSelector((state) => state.auth);
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    if (hasAttemptedRestore.current) {
      return;
    }

    const restoreSession = async () => {
      try {
        // Bước 1: Thử refresh token từ cookie
        await dispatch(refreshAccessToken()).unwrap();

        // Bước 2: Kiểm tra xem đã có user chưa
        if (!user) {
          await dispatch(getUserMe()).unwrap();
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        // Không có session hoặc refresh thất bại → Set isInitializing = false
        dispatch(setInitializing(false));
      }
    };

    hasAttemptedRestore.current = true;
    restoreSession();
  }, [dispatch, user]);
}
