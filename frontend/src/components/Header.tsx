import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Search,
  LogOut,
  User as UserIcon,
  Heart,
  Package,
  TrendingUp,
  LayoutDashboard,
  ChevronRight,
  Grid,
  Smartphone,
  Laptop,
  Headphones,
  Menu,
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
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectIsCacheValid,
} from "@/store/slices/categorySlice";
import { cn } from "@/lib/utils";

// Helper function to select icon based on category slug
const getCategoryIcon = (slug: string) => {
  if (slug?.includes("dien-thoai")) return <Smartphone className="w-5 h-5" />;
  if (slug?.includes("laptop")) return <Laptop className="w-5 h-5" />;
  if (slug?.includes("am-thanh")) return <Headphones className="w-5 h-5" />;
  return <Grid className="w-5 h-5" />;
};

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // --- STATE ---
  const initialQuery =
    location.pathname === "/search" ? searchParams.get("q") || "" : "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    (typeof categories)[0] | null
  >(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectCategoriesLoading);
  const isCacheValid = useAppSelector(selectIsCacheValid);

  // Fetch data
  useEffect(() => {
    if (!isCacheValid && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isCacheValid, categoriesLoading]);

  // Auto-select first category when menu opens
  useEffect(() => {
    if (showMegaMenu && categories && categories.length > 0) {
      const timer = setTimeout(() => {
        setActiveCategory(categories[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showMegaMenu, categories]);

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMegaMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMegaMenu(false);
    }
  };

  const handleLogout = async () => {
    const currentPath = window.location.pathname;
    const protectedPaths = ["/app", "/seller", "/bidder", "/admin"];
    const isProtectedRoute = protectedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    await dispatch(logoutUser()).unwrap();

    if (isProtectedRoute) {
      navigate("/auth/login", { replace: true });
    } else {
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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur shadow-sm px-16">
      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              className="h-10 w-10 object-contain"
              alt="Logo"
            />
            <span className="text-xl font-bold hidden sm:block text-primary">
              AuctionHub
            </span>
          </Link>

          {/* --- MEGA MENU BUTTON & DROPDOWN --- */}
          <div ref={menuRef} className="static">
            <Button
              variant="secondary"
              className={cn(
                "gap-3 font-semibold transition-colors h-12 px-6",
                showMegaMenu
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-transparent text-gray-700 hover:bg-transparent"
              )}
              onClick={() => setShowMegaMenu(!showMegaMenu)}
            >
              <Menu className="h-6 w-6" />
              <span className="hidden md:inline text-base">Danh mục</span>
            </Button>

            {/* --- MEGA MENU CONTENT --- */}
            {showMegaMenu && categories && categories.length > 0 && (
              <div
                className="absolute top-16 left-0 w-full md:max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ height: "550px" }}
              >
                {/* LEFT COLUMN: PARENT CATEGORIES */}
                <div className="w-70 shrink-0 bg-gray-50 overflow-y-auto border-r scrollbar-thin scrollbar-thumb-gray-200">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 cursor-pointer transition-all text-sm font-medium border-l-[3px]",
                        activeCategory?.id === category.id
                          ? "bg-white text-primary border-primary shadow-sm z-10 relative"
                          : "text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(category.slug)}
                        <span className="line-clamp-1">{category.name}</span>
                      </div>
                      {activeCategory?.id === category.id && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN: SUBCATEGORIES GRID */}
                <div className="flex-1 p-6 overflow-y-auto bg-white">
                  {activeCategory ? (
                    <div className="h-full flex flex-col">
                      {/* Header of right column */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {activeCategory.name}
                        </h3>
                        <Link
                          to={`/category/${activeCategory.slug}`}
                          onClick={() => setShowMegaMenu(false)}
                          className="text-sm font-medium text-primary hover:underline flex items-center group"
                        >
                          Xem tất cả{" "}
                          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>

                      {/* Grid of subcategories */}
                      {activeCategory.subcategories &&
                      activeCategory.subcategories.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {activeCategory.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/category/${sub.id}`}
                              onClick={() => setShowMegaMenu(false)}
                              className="group block p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            >
                              <div className="font-semibold text-gray-800 group-hover:text-primary mb-1">
                                {sub.name}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1">
                                Xem chi tiết
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                          <Package className="h-12 w-12 mb-2 opacity-20" />
                          <p>Chưa có danh mục con</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">Đang tải...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="ml-auto w-full max-w-sm mr-4"
          >
            <div className="relative group">
              <Input
                placeholder="Bạn muốn mua gì hôm nay?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-10 w-full rounded-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-primary/50 transition-all shadow-sm"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full text-gray-500 hover:text-primary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* User Menu */}
          <div className="flex gap-2 shrink-0 ml-2">
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
                      <DropdownMenuItem onClick={() => navigate("/bidder/orders") }>
                        <Package className="mr-2 h-4 w-4" />
                        Đơn hàng của tôi
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
                    <LogOut className="mr-2 h-4 w-4 text-destructive focus:text-destructive" />
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
