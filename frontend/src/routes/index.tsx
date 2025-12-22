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

// Lazy load pages
const HomePage = lazy(() => import("./Homepage"));
const UnauthorizedPage = lazy(() => import("./unauthorized"));
const ProductDetailPage = lazy(() => import("./product-detail"));
const CategoryProductsPage = lazy(() => import("./category-products"));
const SearchPage = lazy(() => import("./search"));
const ProfilePage = lazy(() => import("./profile"));

// Auth Pages
const LoginPage = lazy(() => import("./auth/login"));
const RegisterPage = lazy(() => import("./auth/register"));
const ForgotPasswordPage = lazy(() => import("./auth/forgot-password"));

// Error Pages
const NotFoundPage = lazy(() => import("./not-found"));

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
          <PageWrapper title="Trang chủ - Sàn đấu giá trực tuyến">
            <HomePage />
          </PageWrapper>
        ),
      },
      {
        path: "products/:id",
        element: (
          <PageWrapper title="Chi tiết sản phẩm">
            <ProductDetailPage />
          </PageWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <PageWrapper title="Danh sách sản phẩm">
            <CategoryProductsPage />
          </PageWrapper>
        ),
      },
      {
        path: "category/:category",
        element: (
          <PageWrapper title="Danh mục sản phẩm">
            <CategoryProductsPage />
          </PageWrapper>
        ),
      },
      {
        path: "search",
        element: (
          <PageWrapper title="Tìm kiếm sản phẩm">
            <SearchPage />
          </PageWrapper>
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
          <PageWrapper title="Đăng nhập">
            <LoginPage />
          </PageWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <PageWrapper title="Đăng ký tài khoản">
            <RegisterPage />
          </PageWrapper>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PageWrapper title="Quên mật khẩu">
            <ForgotPasswordPage />
          </PageWrapper>
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
          <PageWrapper title="Dashboard - Admin">
            <DashboardPage />
          </PageWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <PageWrapper title="Quản lý Users - Admin">
            <UsersPage />
          </PageWrapper>
        ),
      },
      {
        path: "auctions",
        element: (
          <PageWrapper title="Quản lý Auctions - Admin">
            <AuctionsPage />
          </PageWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <PageWrapper title="Quản lý Danh mục - Admin">
            <CategoriesPage />
          </PageWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <PageWrapper title="Quản lý Sản phẩm - Admin">
            <ProductsPage />
          </PageWrapper>
        ),
      },
      {
        path: "upgrade-requests",
        element: (
          <PageWrapper title="Yêu cầu nâng cấp - Admin">
            <UpgradeRequestsPage />
          </PageWrapper>
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
            <ProfilePage />
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
      <PageWrapper title="Không có quyền truy cập">
        <UnauthorizedPage />
      </PageWrapper>
    ),
  },

  // Catch all - 404 Not Found
  {
    path: "*",
    element: (
      <PageWrapper title="404 - Không tìm thấy trang">
        <NotFoundPage />
      </PageWrapper>
    ),
  },
]);
