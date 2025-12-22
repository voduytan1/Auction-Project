import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, LogOut, User as UserIcon } from "lucide-react";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectIsCacheValid,
} from "@/store/slices/categorySlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      {/* ================= TOP HEADER ================= */}
      <header className="border-b bg-background">
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
                      className="flex items-center gap-3 h-auto py-2"
                    >
                      <div className="text-sm text-right hidden sm:block">
                        <p className="font-medium">
                          {user.hoVaTen || user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.username}
                        </p>
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.anhDaiDien}
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Trang cá nhân
                    </DropdownMenuItem>
                    {user.vaitro === "ADMIN" && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Quản trị
                      </DropdownMenuItem>
                    )}
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

      {/* ================= CATEGORY BAR ================= */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center gap-1">
            {/* Home */}
            <Link
              to="/"
              className="flex items-center gap-1 px-3 h-10 text-sm font-medium hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Trang chủ
            </Link>

            {/* Categories - Success State (only show if we have categories) */}
            {!categoriesLoading &&
              !categoriesError &&
              categories &&
              categories.length > 0 && (
                <NavigationMenu>
                  <NavigationMenuList>
                    {categories.map((category) => (
                      <NavigationMenuItem key={category.id}>
                        <NavigationMenuTrigger
                          className="h-10 bg-transparent hover:bg-transparent hover:underline hover:text-accent focus:bg-transparent focus:underline focus:text-accent data-[state=open]:bg-transparent"
                          onClick={() => navigate(`/category/${category.slug}`)}
                        >
                          {category.name}
                        </NavigationMenuTrigger>
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <NavigationMenuContent>
                              <ul className="grid w-[200px] gap-2 p-2">
                                {category.subcategories.map((sub) => (
                                  <li key={sub.id}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        to={`/category/${sub.slug}`}
                                        className="block select-none rounded-md p-3 leading-none outline-none"
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
              )}
          </div>
        </div>
      </div>
    </>
  );
}
