import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Verify token còn tồn tại trong localStorage
  // Nếu Redux state có isAuthenticated=true nhưng localStorage không có token
  // => User đã logout nhưng bấm back button => Phải redirect về login
  const hasToken = !!localStorage.getItem("accessToken");

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user?.vaitro !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
