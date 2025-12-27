import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Chỉ cần check Redux state isAuthenticated
  // Token nằm trong memory (Redux state), không còn trong localStorage
  // Nếu F5, AuthRestoreWrapper sẽ restore session qua refresh token
  if (!isAuthenticated) {
    // Lưu location hiện tại để sau khi login redirect lại
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.vaitro !== requiredRole) {
    // Không đủ quyền -> Redirect về home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
