import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  FolderTree,
  Package,
  UserCog,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { useAppSelector } from "@/store/hooks";
import UserDropdown from "@/components/UserDropdown";

/**
 * AdminLayout - For admin dashboard
 * Pages: Dashboard, Users Management, Categories, Products, Upgrade Requests, Settings
 * Note: Admin does NOT manage auctions (per requirements)
 */
const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { to: "/admin/statistics", icon: BarChart3, label: "Thống kê" },
    { to: "/admin/users", icon: Users, label: "Người dùng" },
    { to: "/admin/categories", icon: FolderTree, label: "Danh mục" },
    { to: "/admin/products", icon: Package, label: "Sản phẩm" },
    { to: "/admin/upgrade-requests", icon: UserCog, label: "Yêu cầu nâng cấp" },
  ];

  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r shadow-sm transition-all duration-300 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 h-full",
          "lg:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={cn(
              "h-14 sm:h-16 border-b flex items-center gap-2 sm:gap-3",
              sidebarOpen ? "px-3 sm:px-4" : "justify-center px-2"
            )}
          >
            {/* Close button for mobile */}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            {sidebarOpen ? (
              <>
                <Link to="/" className="flex items-center gap-2 sm:gap-3">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                  />
                  <span className="font-bold text-base sm:text-lg">
                    AuctionHub
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto hidden lg:flex h-8 w-8"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <ChevronLeft className="h-4 w-4 transition-transform" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-10 w-10"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronLeft className="h-5 w-5 transition-transform rotate-180" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full h-10 sm:h-11 text-sm sm:text-base",
                      sidebarOpen ? "justify-start" : "justify-center px-0",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", !sidebarOpen && "h-6 w-6")}
                    />
                    {sidebarOpen && (
                      <span className="ml-2 sm:ml-3">{item.label}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="p-3 sm:p-4 border-t border-border">
            <Link
              to="/admin/settings"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <Button
                variant={
                  location.pathname === "/admin/settings"
                    ? "secondary"
                    : "ghost"
                }
                className={cn(
                  "w-full h-10 sm:h-11 text-sm sm:text-base",
                  sidebarOpen ? "justify-start" : "justify-center px-0",
                  location.pathname === "/admin/settings" &&
                    "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Settings
                  className={cn("h-5 w-5", !sidebarOpen && "h-6 w-6")}
                />
                {sidebarOpen && <span className="ml-2 sm:ml-3">Cài đặt</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-16 bg-card border-b flex items-center px-3 sm:px-4 md:px-6 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate">
                {navItems.find((item) => item.to === location.pathname)
                  ?.label ||
                  (location.pathname === "/admin/settings"
                    ? "Cài đặt"
                    : "Admin Panel")}
              </h1>
            </div>
            {user && <UserDropdown user={user} />}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
