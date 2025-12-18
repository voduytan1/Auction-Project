import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gavel,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "../../lib/utils";

/**
 * AdminLayout - For admin dashboard
 * Pages: Dashboard, Users Management, Auctions Management, Settings
 */
const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Quản lý Users" },
    { to: "/admin/auctions", icon: Gavel, label: "Quản lý Auctions" },
    { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth/login";
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

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                !sidebarOpen && "justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </Button>
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
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@example.com
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">A</span>
              </div>
            </div>
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
