import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  FolderTree,
  Package,
  UserCog,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

/**
 * AdminLayout - For admin dashboard
 * Pages: Dashboard, Users Management, Categories, Products, Upgrade Requests, Settings
 * Note: Admin does NOT manage auctions (per requirements)
 */
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Người dùng" },
    { to: "/admin/categories", icon: FolderTree, label: "Danh mục" },
    { to: "/admin/products", icon: Package, label: "Sản phẩm" },
    { to: "/admin/upgrade-requests", icon: UserCog, label: "Yêu cầu nâng cấp" },
  ];

  const handleLogout = async () => {
    // Wait for logout to complete (clears localStorage)
    await dispatch(logoutUser()).unwrap();
    // Admin layout luôn redirect về login vì tất cả admin routes đều protected
    // Dùng replace: true để không thể back lại trang admin
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
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
          "bg-card border-r shadow-sm transition-all duration-300 flex flex-col fixed lg:relative inset-y-0 left-0 z-50",
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 sm:h-16 bg-card border-b flex items-center px-3 sm:px-4 md:px-6 shadow-sm">
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
                  ?.label || "Admin Panel"}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 sm:gap-3 h-auto py-1 sm:py-2 px-1 sm:px-2"
                >
                  <div className="text-xs sm:text-sm text-right hidden md:block">
                    <p className="font-medium">
                      {user?.hoVaTen || user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.username}
                    </p>
                  </div>
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <AvatarImage
                      src={user?.anhDaiDien}
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user?.username?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Trang cá nhân
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4 text-destructive" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
