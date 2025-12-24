import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  LogOut,
  User as UserIcon,
  Heart,
  Package,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

/**
 * UserHeader - Header cho Seller và Bidder (không có category bar)
 */
export default function UserHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    const currentPath = window.location.pathname;
    const protectedPaths = ["/app", "/seller", "/bidder", "/admin"];
    const isProtectedRoute = protectedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    await dispatch(logoutUser());

    // Chỉ redirect về login nếu đang ở protected route
    // Dùng replace: true để không thể back lại
    if (isProtectedRoute) {
      navigate("/auth/login", { replace: true });
    } else {
      // Reload page để clear Redux state cache
      window.location.reload();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-destructive text-destructive-foreground";
      case "SELLER":
        return "bg-blue-500 text-white";
      case "BIDDER":
        return "bg-green-500 text-white";
      default:
        return "bg-secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị";
      case "SELLER":
        return "Người bán";
      case "BIDDER":
        return "Người mua";
      default:
        return role;
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4 justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" className="h-10 w-10" />
            <span className="text-xl font-bold hidden sm:block">
              AuctionHub
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Auth / User Menu */}
          <div className="flex gap-2 shrink-0">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 h-auto py-2 px-3"
                  >
                    <div className="text-sm text-right hidden sm:block">
                      <p className="font-medium">
                        {user.hoVaTen || user.username}
                      </p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Badge
                          className={cn(
                            "text-xs px-1.5 py-0",
                            getRoleBadgeColor(user.vaitro)
                          )}
                        >
                          {getRoleLabel(user.vaitro)}
                        </Badge>
                      </div>
                    </div>
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src={user.anhDaiDien} alt={user.username} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.hoVaTen || user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Common items */}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Trang cá nhân
                  </DropdownMenuItem>

                  {/* Role-specific items */}
                  {user.vaitro === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Quản trị
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.vaitro === "SELLER" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Người bán
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigate("/seller/products")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Sản phẩm của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/seller/products/create")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Đăng sản phẩm
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.vaitro === "BIDDER" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Người mua
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigate("/bidder/profile")}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Hồ sơ của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/bidder/watchlist")}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Danh sách yêu thích
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/bidder/upgrade-request")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Nâng cấp Seller
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate("/auth/register")}>
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
