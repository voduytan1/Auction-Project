import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import MainLayout from "../components/layout/MainLayout";

// Auth Guard
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public Pages
import Homepage from "./homepage";
import UnauthorizedPage from "./unauthorized";

// Auth Pages
import LoginPage from "./auth/login";
import RegisterPage from "./auth/register";

// Admin Pages
import DashboardPage from "./admin/dashboard";
import UsersPage from "./admin/users";
import AuctionsPage from "./admin/auctions";

export const router = createBrowserRouter([
  // Public homepage
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },

  // Auth routes (Login, Register, etc.)
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },

  // Admin routes (Protected) - TEMPORARILY DISABLED FOR TESTING
  {
    path: "/admin",
    element: <AdminLayout />,
    // element: (
    //   <ProtectedRoute requiredRole="ADMIN">
    //     <AdminLayout />
    //   </ProtectedRoute>
    // ),
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "auctions",
        element: <AuctionsPage />,
      },
      {
        path: "settings",
        element: <div>Settings Page Coming Soon</div>,
      },
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
    ],
  },

  // Authenticated user routes (Bidders, Sellers)
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "auctions",
        element: <div>Auctions List</div>,
      },
      {
        path: "auctions/:id",
        element: <div>Auction Details</div>,
      },
      {
        path: "my-bids",
        element: <div>My Bids</div>,
      },
      {
        path: "my-auctions",
        element: <div>My Auctions (Seller)</div>,
      },
      {
        path: "profile",
        element: <div>User Profile</div>,
      },
      {
        index: true,
        element: <Navigate to="/app/auctions" replace />,
      },
    ],
  },

  // Utility routes
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // Catch all - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
