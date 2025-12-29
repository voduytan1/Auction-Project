import { Navigate } from "react-router";
import { useAppSelector } from "@/store/hooks";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  // Redirect based on user role
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (user.vaitro) {
    case "BIDDER":
      return <Navigate to="/bidder/profile" replace />;
    case "SELLER":
      return <Navigate to="/seller/profile" replace />;
    case "ADMIN":
      return <Navigate to="/admin/profile" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
