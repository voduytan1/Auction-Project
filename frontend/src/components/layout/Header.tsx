import { useState } from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

/* ================= MOCK DATA ================= */

const categories = [
  {
    id: 1,
    name: "Điện tử",
    slug: "electronics",
    subcategories: [
      { id: 11, name: "Điện thoại di động", slug: "phones" },
      { id: 12, name: "Máy tính xách tay", slug: "laptops" },
      { id: 13, name: "Máy tính bảng", slug: "tablets" },
      { id: 14, name: "Tai nghe", slug: "headphones" },
    ],
  },
  {
    id: 2,
    name: "Thời trang",
    slug: "fashion",
    subcategories: [
      { id: 21, name: "Giày dép", slug: "shoes" },
      { id: 22, name: "Đồng hồ", slug: "watches" },
      { id: 23, name: "Túi xách", slug: "bags" },
    ],
  },
  {
    id: 3,
    name: "Nhà cửa & Đời sống",
    slug: "home",
    subcategories: [
      { id: 31, name: "Nội thất", slug: "furniture" },
      { id: 32, name: "Đồ gia dụng", slug: "household" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Header() {
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
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.vaitro}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
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
                    <DropdownMenuItem onClick={handleLogout}>
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

            {/* Categories */}
            <NavigationMenu>
              <NavigationMenuList>
                {categories.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    <NavigationMenuTrigger
                      className="h-10"
                      onClick={() => navigate(`/category/${category.slug}`)}
                    >
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-2 p-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/category/${sub.slug}`}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </>
  );
}
