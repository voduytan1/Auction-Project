import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gavel,
  Settings,
  LogOut,
  ChevronLeft,
  FolderTree,
  Package,
  UserCog,
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
 * Pages: Dashboard, Users Management, Auctions Management, Settings
 */
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Người dùng" },
    { to: "/admin/categories", icon: FolderTree, label: "Danh mục" },
    { to: "/admin/products", icon: Package, label: "Sản phẩm" },
    { to: "/admin/auctions", icon: Gavel, label: "Đấu giá" },
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
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r shadow-sm transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 border-b flex items-center px-4 gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              {sidebarOpen && (
                <span className="font-bold text-lg">AuctionHub</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  !sidebarOpen && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11",
                      !sidebarOpen && "justify-center px-2",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", !sidebarOpen && "h-6 w-6")}
                    />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-border">
            <Link to="/admin/settings">
              <Button
                variant={
                  location.pathname === "/admin/settings"
                    ? "secondary"
                    : "ghost"
                }
                className={cn(
                  "w-full justify-start h-11",
                  !sidebarOpen && "justify-center px-2",
                  location.pathname === "/admin/settings" &&
                    "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Settings
                  className={cn("h-5 w-5", !sidebarOpen && "h-6 w-6")}
                />
                {sidebarOpen && <span className="ml-3">Cài đặt</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center px-6 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl font-semibold">
                {navItems.find((item) => item.to === location.pathname)
                  ?.label || "Admin Panel"}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 h-auto py-2"
                >
                  <div className="text-sm text-right">
                    <p className="font-medium">
                      {user?.hoVaTen || user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.username}
                    </p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.anhDaiDien}
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback>
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
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
