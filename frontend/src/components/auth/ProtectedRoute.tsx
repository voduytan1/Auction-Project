import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // TODO: Replace with Redux state when auth slices are ready
  const accessToken = localStorage.getItem("accessToken");
  const isAuthenticated = !!accessToken;

  // Get user from localStorage temporarily
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
