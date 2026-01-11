import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Search, ChevronRight, Grid, Menu, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectIsCacheValid,
} from "@/store/slices/categorySlice";
import { cn } from "@/lib/utils";
import UserDropdown from "@/components/UserDropdown";

// Helper function to select icon - Using same icon for all categories
const getCategoryIcon = () => {
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
  const { register, handleSubmit, setValue } = useForm<{
    searchQuery: string;
  }>({
    defaultValues: { searchQuery: initialQuery },
  });
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

  // Update search query when URL changes
  useEffect(() => {
    const query =
      location.pathname === "/search" ? searchParams.get("q") || "" : "";
    setValue("searchQuery", query);
  }, [location.pathname, searchParams, setValue]);

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

  const handleSearch = (data: { searchQuery: string }) => {
    if (data.searchQuery.trim()) {
      const query = data.searchQuery.trim();
      // If already on search page with same query, force reload by updating timestamp
      if (location.pathname === "/search" && searchParams.get("q") === query) {
        navigate(`/search?q=${encodeURIComponent(query)}&t=${Date.now()}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowMegaMenu(false);
      setShowMobileSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 lg:px-16 relative">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-1 sm:gap-2 md:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 shrink-0">
            <img
              src="/logo.png"
              className="h-8 sm:h-10 w-8 sm:w-10 object-contain"
              alt="Logo"
            />
            <span className="text-base sm:text-xl font-bold hidden sm:block text-primary">
              AuctionHub
            </span>
          </Link>

          {/* --- MEGA MENU BUTTON & DROPDOWN --- */}
          <div ref={menuRef} className="static">
            <Button
              variant="secondary"
              className={cn(
                "gap-1 sm:gap-2 font-semibold transition-colors h-9 sm:h-10 md:h-12 px-2 sm:px-3 md:px-6",
                showMegaMenu
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-transparent text-gray-700 hover:bg-transparent"
              )}
              onClick={() => setShowMegaMenu(!showMegaMenu)}
            >
              <Menu className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
              <span className="hidden md:inline text-sm md:text-base">
                Danh mục
              </span>
            </Button>

            {/* --- MEGA MENU CONTENT --- */}
            {showMegaMenu && categories && categories.length > 0 && (
              <div className="absolute top-14 sm:top-16 left-0 right-0 w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col sm:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[calc(100vh-5rem)]">
                {/* LEFT COLUMN: PARENT CATEGORIES */}
                <div className="w-full sm:w-48 md:w-56 lg:w-70 shrink-0 bg-gray-50 overflow-y-auto border-b sm:border-b-0 sm:border-r scrollbar-thin scrollbar-thumb-gray-200 max-h-48 sm:max-h-none">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-3 cursor-pointer transition-all text-xs sm:text-sm font-medium border-l-[3px]",
                        activeCategory?.id === category.id
                          ? "bg-white text-primary border-primary shadow-sm z-10 relative"
                          : "text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:block">
                          {getCategoryIcon()}
                        </div>
                        <span className="line-clamp-1 text-xs sm:text-sm">
                          {category.name}
                        </span>
                      </div>
                      {activeCategory?.id === category.id && (
                        <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN: SUBCATEGORIES GRID */}
                <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-white">
                  {activeCategory ? (
                    <div className="h-full flex flex-col">
                      {/* Header of right column */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 pb-2 sm:pb-3 md:pb-4 border-b">
                        <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                          {activeCategory.name}
                        </h3>
                        <Link
                          to={`/parent-category/${activeCategory.id}`}
                          onClick={() => setShowMegaMenu(false)}
                          className="text-xs sm:text-sm font-medium text-primary hover:underline flex items-center group whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Xem tất cả</span>
                          <span className="sm:hidden">Tất cả</span>
                          <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>

                      {/* Grid of subcategories */}
                      {activeCategory.subcategories &&
                      activeCategory.subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                          {activeCategory.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/category/${sub.id}`}
                              onClick={() => setShowMegaMenu(false)}
                              className="group block p-2 sm:p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            >
                              <div className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary mb-0.5 sm:mb-1">
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

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSubmit(handleSearch)}
            className="hidden md:flex ml-auto w-full max-w-sm mr-2 lg:mr-4"
          >
            <div className="relative group w-full">
              <Input
                placeholder="Bạn muốn mua gì hôm nay?"
                {...register("searchQuery")}
                className="pr-10 h-9 md:h-10 w-full rounded-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-primary/50 transition-all shadow-sm text-sm"
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

          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-9 w-9 p-0"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {isAuthenticated && user ? (
              <UserDropdown user={user} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth/login")}
                  className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2 sm:px-3 md:px-4"
                >
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/auth/register")}
                  className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2 sm:px-3 md:px-4"
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b shadow-lg p-3 animate-in slide-in-from-top-2 z-40">
            <form onSubmit={handleSubmit(handleSearch)}>
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  {...register("searchQuery")}
                  className="pr-10 h-10 w-full rounded-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-primary/50 transition-all"
                  autoFocus
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
          </div>
        )}
      </div>
    </header>
  );
}
