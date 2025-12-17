import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

// Layouts - Không lazy load layouts vì cần instant
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import MainLayout from "../components/layout/MainLayout";

// Auth Guard
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Route Wrappers
import { PageWrapper } from "../components/PageWrapper";
import { SuspenseWrapper } from "../components/SuspenseWrapper";

// Lazy load pages
const HomePage = lazy(() => import("./Homepage"));
const UnauthorizedPage = lazy(() => import("./unauthorized"));

// Auth Pages
const LoginPage = lazy(() => import("./auth/login"));
const RegisterPage = lazy(() => import("./auth/register"));

// Admin Pages
const DashboardPage = lazy(() => import("./admin/dashboard"));
const UsersPage = lazy(() => import("./admin/users"));
const AuctionsPage = lazy(() => import("./admin/auctions"));
const CategoriesPage = lazy(() => import("./admin/categories"));
const ProductsPage = lazy(() => import("./admin/products"));
const UpgradeRequestsPage = lazy(() => import("./admin/upgrade-requests"));

/**
 * Router configuration với lazy loading và SEO
 */
export const router = createBrowserRouter([
  // Public homepage
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Trang chủ - Sàn đấu giá trực tuyến">
              <HomePage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Auth routes (Login, Register)
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Đăng nhập">
              <LoginPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Đăng ký tài khoản">
              <RegisterPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },

  // Admin routes - TEMPORARILY DISABLED AUTH FOR TESTING
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
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Dashboard - Admin">
              <DashboardPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Quản lý Users - Admin">
              <UsersPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "auctions",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Quản lý Auctions - Admin">
              <AuctionsPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Quản lý Danh mục - Admin">
              <CategoriesPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Quản lý Sản phẩm - Admin">
              <ProductsPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "upgrade-requests",
        element: (
          <SuspenseWrapper>
            <PageWrapper title="Yêu cầu nâng cấp - Admin">
              <UpgradeRequestsPage />
            </PageWrapper>
          </SuspenseWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <PageWrapper title="Cài đặt - Admin">
            <div>Settings Page Coming Soon</div>
          </PageWrapper>
        ),
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
        element: (
          <PageWrapper title="Danh sách đấu giá">
            <div>Auctions List</div>
          </PageWrapper>
        ),
      },
      {
        path: "auctions/:id",
        element: (
          <PageWrapper title="Chi tiết đấu giá">
            <div>Auction Details</div>
          </PageWrapper>
        ),
      },
      {
        path: "my-bids",
        element: (
          <PageWrapper title="Lượt đấu của tôi">
            <div>My Bids</div>
          </PageWrapper>
        ),
      },
      {
        path: "my-auctions",
        element: (
          <PageWrapper title="Đấu giá của tôi">
            <div>My Auctions (Seller)</div>
          </PageWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <PageWrapper title="Hồ sơ cá nhân">
            <div>User Profile</div>
          </PageWrapper>
        ),
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
    element: (
      <SuspenseWrapper>
        <PageWrapper title="Không có quyền truy cập">
          <UnauthorizedPage />
        </PageWrapper>
      </SuspenseWrapper>
    ),
  },

  // Catch all - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
