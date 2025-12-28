import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilters } from "./components/SearchFilters";
import { EmptyState } from "./components/EmptyState";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchResults() {
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

  const ITEMS_PER_PAGE = 8;

  // Update URL khi filters thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (submittedQuery) params.set("q", submittedQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (sortBy !== "endTime-desc") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
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

  // Get unique categories from products - TODO: fetch from category API
  const categories = Array.from(
    new Map(
      products.map((p) => [
        p.categoryId,
        {
          categoryid: p.categoryId,
          tenDanhMuc: p.tenDanhMuc,
          level: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    ).values()
  );

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {submittedQuery
            ? `Kết quả tìm kiếm cho "${submittedQuery}"`
            : "Tìm kiếm sản phẩm"}
        </h1>
        <p className="text-muted-foreground">
          Tìm thấy {totalProducts} sản phẩm
        </p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {sortedProducts.map((product) => (
              <ProductCard key={product.productid} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
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
                            className="h-9 w-9"
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
                            className="flex items-center px-2 text-sm"
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
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
