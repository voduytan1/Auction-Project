import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { SearchFilters } from "./components/SearchFilters";
import { EmptyState } from "./components/EmptyState";
import { Pagination } from "./components/Pagination";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import { formatCurrency, getTimeRemaining } from "./helpers";
import { Link } from "react-router";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

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
          size: itemsPerPage,
        });

        // Backend returns plain array ProductResponse[]
        const resp = response.data;
        const productsData = Array.isArray(resp) ? resp : resp?.data || [];
        const metadata = resp?.metadata;

        const totalElementsFallback =
          metadata?.totalElements ?? productsData.length ?? 0;
        const totalPagesFallback =
          metadata?.totalPages ??
          Math.ceil(totalElementsFallback / itemsPerPage);

        setProducts(productsData);
        setTotalPages(totalPagesFallback);
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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Kết quả tìm kiếm cho "{submittedQuery}"
        </h1>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
            {error}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const timeRemaining = getTimeRemaining(product.thoiGianKetThuc);
              return (
                <Link
                  key={product.productid}
                  to={`/products/${product.productid}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.tenSanPham}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                      {product.giaMuaNgay && (
                        <Badge
                          className="absolute top-2 right-2"
                          variant="secondary"
                        >
                          Mua ngay
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                        {product.tenSanPham}
                      </h3>

                      {/* Price */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="text-lg font-bold text-accent">
                            {formatCurrency(product.giaHienTai)}
                          </span>
                        </div>
                        {product.giaMuaNgay && (
                          <div className="text-sm text-muted-foreground">
                            Mua ngay: {formatCurrency(product.giaMuaNgay)}
                          </div>
                        )}
                      </div>

                      {/* Time & Seller */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{timeRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
