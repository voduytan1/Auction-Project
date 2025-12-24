import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Search,
  X,
  LogOut,
  User as UserIcon,
  Heart,
  Package,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
  selectCategoriesError,
  selectIsCacheValid,
} from "@/store/slices/categorySlice";
import { cn } from "@/lib/utils";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Sync search input with URL params when on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const query = searchParams.get("q") || "";
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }
  }, [location.pathname, searchParams]);

  // Get categories from Redux store
  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectCategoriesLoading);
  const categoriesError = useAppSelector(selectCategoriesError);
  const isCacheValid = useAppSelector(selectIsCacheValid);

  // Fetch categories only if cache is invalid
  useEffect(() => {
    if (!isCacheValid && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isCacheValid, categoriesLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setIsSearchExpanded(false);
    } else if (location.pathname === "/search") {
      // Clear search if empty on search page
      navigate("/search");
      setIsSearchExpanded(false);
    }
  };

  const toggleSearch = () => {
    if (isSearchExpanded) {
      setSearchQuery("");
      setIsSearchExpanded(false);
    } else {
      setIsSearchExpanded(true);
    }
  };

  const handleLogout = async () => {
    const currentPath = window.location.pathname;
    const protectedPaths = ["/app", "/seller", "/bidder", "/admin"];
    const isProtectedRoute = protectedPaths.some((path) =>
      currentPath.startsWith(path)
    );

    // Wait for logout to complete (clears localStorage)
    await dispatch(logoutUser()).unwrap();

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
    <>
      {/* ================= MAIN HEADER ================= */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo.png" className="h-10 w-10" alt="Logo" />
              <span className="text-xl font-bold hidden sm:block">
                AuctionHub
              </span>
            </Link>

            {/* Categories - Hidden when search expanded */}
            {!isSearchExpanded &&
              !categoriesLoading &&
              !categoriesError &&
              categories &&
              categories.length > 0 && (
                <div className="flex items-center gap-1 flex-1">
                  <NavigationMenu>
                    <NavigationMenuList>
                      {categories.map((category) => (
                        <NavigationMenuItem key={category.id}>
                          <NavigationMenuTrigger
                            className="h-10 bg-transparent hover:bg-muted hover:text-primary focus:bg-muted focus:text-primary data-[state=open]:bg-muted data-[state=open]:text-primary rounded-md transition-colors"
                            onClick={() =>
                              navigate(`/category/${category.slug}`)
                            }
                          >
                            {category.name}
                          </NavigationMenuTrigger>
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-1 p-2">
                                  {category.subcategories.map((sub) => (
                                    <li key={sub.id}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          to={`/category/${sub.slug}`}
                                          className="block select-none rounded-md p-3 leading-none outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                          <div className="text-sm font-medium">
                                            {sub.name}
                                          </div>
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </NavigationMenuContent>
                            )}
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )}

            {/* Search - Expanded when active */}
            {isSearchExpanded && (
              <form
                onSubmit={handleSearch}
                className="flex-1 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                    autoFocus
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            )}

            {/* Right side actions */}
            <div className="flex gap-2 shrink-0 ml-auto">
              {/* Search Toggle Button - Hidden when expanded */}
              {!isSearchExpanded && (
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* Auth / User Menu */}
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
                        <AvatarImage
                          src={user.anhDaiDien}
                          alt={user.username}
                        />
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
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth/login")}
                  >
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
    </>
  );
}
