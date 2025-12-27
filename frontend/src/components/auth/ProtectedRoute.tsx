import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { PageLoader } from "../PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isInitializing } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Đợi auth restore hoàn tất trước khi check
  if (isInitializing) {
    return <PageLoader message="Đang xác thực..." className="min-h-screen" />;
  }

  // Chỉ cần check Redux state isAuthenticated
  // Token nằm trong memory (Redux state), không còn trong localStorage
  // Nếu F5, AuthRestoreWrapper sẽ restore session qua refresh token
  if (!isAuthenticated) {
    // Lưu location hiện tại để sau khi login redirect lại
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu role nhưng chưa có user info → Đợi
  if (requiredRole && !user) {
    return (
      <PageLoader message="Đang tải thông tin..." className="min-h-screen" />
    );
  }

  if (requiredRole && user?.vaitro !== requiredRole) {
    // Không đủ quyền -> Redirect về home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
