// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "BIDDER" | "SELLER" | "ADMIN";
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implement auth check when Redux slices are ready
  // const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
