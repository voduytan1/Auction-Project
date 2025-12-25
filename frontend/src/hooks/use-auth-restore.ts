import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./use-redux";
import {
  refreshAccessToken,
  setCredentials,
  logoutUser,
} from "@/store/slices/authSlice";
import { profileAPI } from "@/services/profile.api";

/**
 * Hook để restore authentication state khi app khởi động
 * Flow:
 * - User info được persist vào localStorage
 * - Token chỉ trong memory (bảo mật XSS) - Browser sẽ tự gửi Refresh Token từ HttpOnly Cookie
 * - Khi F5: Check nếu có user nhưng không có token => Gọi refresh để lấy token mới từ cookie
 * - Luôn fetch user mới từ API để đảm bảo data chuẩn (role, status...)
 *
 * @returns isRestoring (boolean) - True khi đang xử lý, False khi đã xong
 */
export function useAuthRestore() {
  const dispatch = useAppDispatch();
  const { user, isInitializing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Nếu không cần khôi phục (đã có token hoặc không là user đã login trước đó)
    if (!isInitializing) {
      return;
    }

    // Cần khôi phục: Có user info từ localStorage nhưng token đã mất (F5)
    const restoreSession = async () => {
      try {
        // Lấy userId từ Redux state hoặc localStorage (trong trường hợp race condition)
        let userId = user?.userid;
        if (!userId) {
          const savedUser = localStorage.getItem("auth_user");
          if (savedUser) {
            try {
              userId = JSON.parse(savedUser).userid;
            } catch {
              /* ignore parse error */
            }
          }
        }

        if (!userId) {
          dispatch(logoutUser());
          return;
        }

        console.log(
          "[AuthRestore] Restoring session - Refresh token from cookie for userId:",
          userId
        );

        // Step 1: Gọi API refresh-token
        // Browser tự động gửi kèm HttpOnly Cookie (Refresh Token)
        // Backend sẽ parse cookie để biết user nào rồi trả về access token mới
        const refreshResult = await dispatch(
          refreshAccessToken(userId)
        ).unwrap();
        console.log("[AuthRestore] Token refreshed successfully");

        // Step 2: Luôn lấy thông tin User mới nhất từ API
        // để đảm bảo data chuẩn (role có thể bị thay đổi bởi admin)
        console.log("[AuthRestore] Fetching fresh user info from API...");
        const userInfo = await profileAPI.getMe();
        console.log("[AuthRestore] User info fetched:", userInfo);

        // Step 3: Update Redux với credentials mới (user từ API mới nhất)
        dispatch(
          setCredentials({
            user: userInfo,
            token: refreshResult.token,
          })
        );

        console.log("[AuthRestore] Session restored successfully");
      } catch (error) {
        console.error("[AuthRestore] Failed to restore session:", error);
        // Refresh token hết hạn/lỗi => Logout để clear state
        dispatch(logoutUser());
      }
    };

    restoreSession();
  }, [dispatch, isInitializing]);

  return isInitializing;
}
