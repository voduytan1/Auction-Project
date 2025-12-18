import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";

// Mock categories data (2 levels)
const categories = [
  {
    id: 1,
    name: "Điện tử",
    subcategories: [
      { id: 11, name: "Điện thoại di động" },
      { id: 12, name: "Máy tính xách tay" },
      { id: 13, name: "Máy tính bảng" },
      { id: 14, name: "Tai nghe" },
    ],
  },
  {
    id: 2,
    name: "Thời trang",
    subcategories: [
      { id: 21, name: "Giày" },
      { id: 22, name: "Đồng hồ" },
      { id: 23, name: "Túi xách" },
      { id: 24, name: "Trang sức" },
    ],
  },
  {
    id: 3,
    name: "Gia dụng",
    subcategories: [
      { id: 31, name: "Nội thất" },
      { id: 32, name: "Thiết bị nhà bếp" },
      { id: 33, name: "Đồ trang trí" },
    ],
  },
  {
    id: 4,
    name: "Thể thao",
    subcategories: [
      { id: 41, name: "Dụng cụ tập gym" },
      { id: 42, name: "Xe đạp" },
      { id: 43, name: "Giày thể thao" },
    ],
  },
  {
    id: 5,
    name: "Sách & Văn phòng phẩm",
    subcategories: [
      { id: 51, name: "Sách" },
      { id: 52, name: "Văn phòng phẩm" },
    ],
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img src="/logo.png" alt="AuctionHub" className="h-16 w-16" />
            <span className="font-bold text-xl">AuctionHub</span>
          </Link>

          {/* Category Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger className="h-9">
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {category.subcategories.map((sub) => (
                        <NavigationMenuLink key={sub.id} asChild>
                          <Link
                            to={`/category/${sub.id}`}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {sub.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right: Search + Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-64 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Auth Buttons */}
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                Đăng nhập
              </Button>
              <Button onClick={() => navigate("/auth/register")}>
                Đăng ký
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
