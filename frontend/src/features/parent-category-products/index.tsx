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
import { Link } from "react-router-dom";
import { categoryApi } from "@/services/category.api";
import { SimplePagination } from "@/components/SimplePagination";
import type { PaginationMetadata } from "@/types/types";
import type { ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { ProductCard } from "@/components/ProductCard";
import { useAppSelector } from "@/store/hooks";
import { selectCategories } from "@/store/slices/categorySlice";

/**
 * Parent Category Products Page (Level 1)
 * Shows all products from a parent category and its subcategories
 * Route: /parent-category/:category
 * API: GET /categories/{id}/products/parent-category
 */
const ParentCategoryProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSize = parseInt(searchParams.get("size") || "12", 10);
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "ending-soon";

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);

  const categories = useAppSelector(selectCategories);

  // Fetch parent category products from API
  useEffect(() => {
    const fetchParentCategoryProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const categoryId = Number(category);

        // Get products from parent category endpoint
        const response = await categoryApi.getProductsByParentCategory(
          categoryId,
          {
            page: currentPage,
            size: currentSize,
            search: searchQuery || undefined,
          }
        );

        const productsData = Array.isArray(response.data) ? response.data : [];
        const metadata = (response as any).__raw__?.metadata;

        setProducts(productsData);

        if (metadata) {
          setPagination(metadata);
        }
      } catch (err) {
        console.error("[ParentCategoryProducts] Error:", err);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchParentCategoryProducts();
  }, [category, currentPage, currentSize, searchQuery]);

  // Sort products on frontend
  const sortedProducts = products
    ? [...products].sort((a, b) => {
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

  // Find category name from Redux store
  const categoryInfo = categories.find((cat) => cat.id === Number(category));
  const categoryName = categoryInfo?.name || "Danh mục";

  // Show loading state only for initial load (no data yet)
  if (loading && products.length === 0) {
    return <PageLoader message="Đang tải danh mục..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
        <Button asChild>
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 text-xs sm:text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground">{categoryName}</li>
        </ol>
      </nav>

      {/* Header with Title & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            {categoryName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tìm thấy {pagination?.totalElements || 0} sản phẩm
          </p>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-full sm:w-50 h-9 sm:h-10 text-sm">
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
      {products.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Không có sản phẩm nào trong danh mục này.
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.productid} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <SimplePagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              pageSize={currentSize}
              onPageChange={handlePageChange}
              itemName="sản phẩm"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ParentCategoryProductsPage;
