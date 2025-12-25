import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./use-redux";
import { logoutUser } from "@/store/slices/authSlice";
import { isProtectedRoute } from "@/lib/route-helpers";

/**
 * Hook để handle logout
 * Tự động:
 * - Gọi API logout (xóa refresh token cookie ở backend)
 * - Clear Redux state (token, user, etc.)
 * - Clear localStorage (auth_user)
 * - Dispatch auth:logout event cho WebSocket
 * - Navigation:
 *   * Nếu ở protected route → Navigate về /auth/login (không reload)
 *   * Nếu ở public route → Stay on page
 *
 * @returns logout function
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const logout = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      // Dispatch logout thunk - sẽ gọi API + clear Redux + clear storage
      await dispatch(logoutUser()).unwrap();

      // Navigate logic (không reload trang)
      const currentPath = window.location.pathname;
      const isOnProtectedRoute = isProtectedRoute(currentPath);

      if (isOnProtectedRoute) {
        // useNavigate không reload, CSR navigation
        navigate("/auth/login", { replace: true });
      }
      // Stay on page, UI sẽ update vì user = null trong Redux
    } catch {
      // Dù API fail, cũng clear local state
      dispatch(logoutUser());

      // Vẫn navigate nếu ở protected route
      const currentPath = window.location.pathname;
      if (isProtectedRoute(currentPath)) {
        navigate("/auth/login", { replace: true });
      }
    }
  }, [dispatch, navigate, isAuthenticated]);

  return logout;
}
