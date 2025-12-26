import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./use-redux";
import {
  refreshAccessToken,
  setCredentials,
  logoutUser,
  finishInitializing,
  hydrateFromLocalStorage,
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
  const { user, token, isInitializing } = useAppSelector((state) => state.auth);
  const hasHydrated = useRef(false);

  // Effect 1: Hydrate từ LocalStorage (Chạy 1 lần duy nhất khi mount)
  useEffect(() => {
    if (!hasHydrated.current) {
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser && !user) {
        // Chỉ nạp nếu Redux chưa có user
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log(
            "[useAuthRestore] Hydrating from localStorage:",
            parsedUser.username
          );
          dispatch(hydrateFromLocalStorage(parsedUser));
        } catch (error) {
          console.error("[useAuthRestore] Failed to parse saved user:", error);
          localStorage.removeItem("auth_user");
        }
      }
      hasHydrated.current = true;
    }
  }, [dispatch, user]);

  // Effect 2: Logic Refresh Token
  useEffect(() => {
    console.log("[useAuthRestore] Restore check", {
      hasToken: !!token,
      hasUser: !!user,
      isInitializing,
      hasHydrated: hasHydrated.current,
    });

    // Nếu đã login rồi (có token) -> Bỏ qua
    if (token) {
      if (isInitializing) {
        console.log("[useAuthRestore] Has token, finishing initialization");
        dispatch(finishInitializing());
      }
      return;
    }

    // Chưa hydrate xong -> Đợi
    if (!hasHydrated.current) {
      console.log("[useAuthRestore] Waiting for hydration");
      return;
    }

    // Case quan trọng: Có User (từ LS) nhưng chưa có Token (F5 trang)
    if (user && !token && isInitializing) {
      const restoreSession = async () => {
        try {
          console.log("[useAuthRestore] Calling refresh token API...");
          const refreshResult = await dispatch(
            refreshAccessToken(user.userid)
          ).unwrap();
          console.log("[useAuthRestore] Token refreshed successfully");

          // Fetch user info mới nhất từ API
          console.log("[useAuthRestore] Fetching fresh user info...");
          const userInfo = await profileAPI.getMe();
          console.log("[useAuthRestore] User info fetched:", userInfo);

          // Update Redux với credentials mới
          dispatch(
            setCredentials({
              user: userInfo,
              token: refreshResult.token,
            })
          );

          console.log("[useAuthRestore] Session restored successfully");
        } catch (error) {
          console.error("[useAuthRestore] Failed to restore session:", error);
          dispatch(logoutUser());
        }
      };

      restoreSession();
    } else if (!user && isInitializing) {
      // Trường hợp khách vãng lai (không có user trong LS)
      console.log("[useAuthRestore] No user found, finishing initialization");
      dispatch(finishInitializing());
    }
  }, [dispatch, isInitializing, user, token]);

  return isInitializing;
}
