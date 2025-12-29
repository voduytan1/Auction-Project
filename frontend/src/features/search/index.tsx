import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilters } from "./components/SearchFilters";
import { EmptyState } from "./components/EmptyState";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectIsCacheValid,
} from "@/store/slices/categorySlice";
import type { CategoryDisplay } from "@/types/types";

export default function SearchResults() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [submittedQuery, setSubmittedQuery] = useState(
    searchParams.get("q") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "endTime-desc"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get categories from Redux store
  const allCategories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectCategoriesLoading);
  const isCacheValid = useAppSelector(selectIsCacheValid);

  const ITEMS_PER_PAGE = 8;

  // Fetch categories from API
  useEffect(() => {
    if (!isCacheValid && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isCacheValid, categoriesLoading]);

  // Sync state with URL params when URL changes (e.g., from Header search)
  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";
    const categoryFromUrl = searchParams.get("category") || "all";
    const sortFromUrl = searchParams.get("sort") || "endTime-desc";
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    setSearchQuery(queryFromUrl);
    setSubmittedQuery(queryFromUrl);
    setCategoryFilter(categoryFromUrl);
    setSortBy(sortFromUrl);
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  // Update URL khi filters thay đổi (but keep timestamp for force reload)
  useEffect(() => {
    const params = new URLSearchParams();
    if (submittedQuery) params.set("q", submittedQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (sortBy !== "endTime-desc") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
    // Preserve timestamp if it exists (for forced reload)
    const timestamp = searchParams.get("t");
    if (timestamp) params.set("t", timestamp);
    setSearchParams(params);
  }, [submittedQuery, categoryFilter, sortBy, currentPage, setSearchParams]);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productAPI.search({
          search: submittedQuery || undefined,
          categoryId:
            categoryFilter !== "all" ? Number(categoryFilter) : undefined,
          page: currentPage,
          size: ITEMS_PER_PAGE,
        });

        // Response interceptor đã extract data, metadata ở __raw__
        const productsData = Array.isArray(response.data) ? response.data : [];
        const metadata = (response as any).__raw__?.metadata;

        setProducts(productsData);
        setTotalProducts(metadata?.totalElements ?? 0);
        setTotalPages(metadata?.totalPages ?? 1);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [submittedQuery, categoryFilter, currentPage]);

  // Sort products on frontend (backend doesn't support sorting yet)
  const sortedProducts = Array.isArray(products)
    ? [...products].sort((a, b) => {
        switch (sortBy) {
          case "endTime-desc":
            return (
              new Date(b.thoiGianKetThuc).getTime() -
              new Date(a.thoiGianKetThuc).getTime()
            );
          case "endTime-asc":
            return (
              new Date(a.thoiGianKetThuc).getTime() -
              new Date(b.thoiGianKetThuc).getTime()
            );
          case "price-asc":
            return a.giaHienTai - b.giaHienTai;
          case "price-desc":
            return b.giaHienTai - a.giaHienTai;
          default:
            return 0;
        }
      })
    : [];

  // Get subcategories (level 2) from Redux store
  const categories: CategoryDisplay[] = allCategories
    ? allCategories.flatMap((parent) => parent.subcategories || [])
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSubmittedQuery("");
    setCategoryFilter("all");
    setSortBy("endTime-desc");
    setCurrentPage(1);
  };

  const showClearButton = Boolean(
    submittedQuery || categoryFilter !== "all" || sortBy !== "endTime-desc"
  );

  // Show loading state only for initial load (no products yet)
  if (loading && !products.length) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
          {submittedQuery
            ? `Kết quả tìm kiếm cho "${submittedQuery}"`
            : "Tìm kiếm sản phẩm"}
        </h1>
        <p className="text-muted-foreground">
          Tìm thấy {totalProducts} sản phẩm
        </p>
        {error && (
          <div className="mt-2 sm:mt-4 rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortBy}
        onSearchSubmit={handleSearch}
        onClearFilters={handleClearFilters}
        showClearButton={showClearButton}
      />

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-12">
            {sortedProducts.map((product) => (
              <ProductCard key={product.productid} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <div className="flex flex-wrap gap-1 justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="flex items-center px-1 sm:px-2 text-xs sm:text-sm"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
