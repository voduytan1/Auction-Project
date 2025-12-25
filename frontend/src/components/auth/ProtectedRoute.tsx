import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Chỉ cần check Redux state isAuthenticated
  // Token nằm trong memory (Redux state), không còn trong localStorage
  // Nếu F5, AuthRestoreWrapper sẽ restore session qua refresh token
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user?.vaitro !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
