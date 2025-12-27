import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryApi } from "@/services/category.api";
import type {
  CategoryWithProductResponse,
  PaginationMetadata,
} from "@/types/types";
import { PageLoader } from "@/components/PageLoader";
import { ProductCard } from "@/components/ProductCard";

const CategoryProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSize = parseInt(searchParams.get("size") || "12", 10);
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "ending-soon";

  const [categoryData, setCategoryData] =
    useState<CategoryWithProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);

  // Fetch category with products from API
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const response = await categoryApi.getCategoryWithProducts(
          Number(category),
          {
            page: currentPage,
            size: currentSize,
            search: searchQuery || undefined,
          }
        );

        console.log("[CategoryDetail] Response:", response);

        // Interceptor extracts data from ApiResponse
        // response.data = CategoryWithProductResponse
        // metadata preserved in __metadata__
        if (response.data) {
          setCategoryData(response.data);
        }

        const metadata = (response as any).__metadata__;
        if (metadata) {
          setPagination(metadata);
        }
      } catch (err) {
        console.error("[CategoryDetail] Error:", err);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, currentPage, currentSize, searchQuery]);

  // Sort products on frontend
  const sortedProducts = categoryData?.products
    ? [...categoryData.products].sort((a, b) => {
        switch (sortBy) {
          case "ending-soon":
            return (
              new Date(a.thoiGianKetThuc).getTime() -
              new Date(b.thoiGianKetThuc).getTime()
            );
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "price-low":
            return a.giaHienTai - b.giaHienTai;
          case "price-high":
            return b.giaHienTai - a.giaHienTai;
          default:
            return 0;
        }
      })
    : [];

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Show loading state only for initial load (no data yet)
  if (loading && !categoryData) {
    return <PageLoader message="Đang tải danh mục..." />;
  }

  // Show error state or "not found" message
  if (error || !categoryData) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          {error || "Danh mục không tồn tại"}
        </h1>
        <Button asChild>
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
          </li>
          {categoryData.parentCategoryId && (
            <>
              <li>/</li>
              <li>
                <Link
                  to={`/category/${categoryData.parentCategoryId}`}
                  className="hover:text-foreground transition-colors"
                >
                  {categoryData.parentCategoryName}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="font-medium text-foreground">
            {categoryData?.tenDanhMuc}
          </li>
        </ol>
      </nav>

      {/* Header with Title & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {categoryData?.tenDanhMuc}
          </h1>
          <p className="text-muted-foreground">
            Tìm thấy {pagination?.totalElements || 0} sản phẩm
          </p>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ending-soon">Sắp kết thúc</SelectItem>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
            <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {categoryData && categoryData.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Không có sản phẩm nào trong danh mục này.
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.productid} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 pb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex flex-wrap gap-1 justify-center">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
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
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProductsPage;
