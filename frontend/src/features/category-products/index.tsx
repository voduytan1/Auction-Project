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
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { ProductCard } from "@/components/ProductCard";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState("ending-soon");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const ITEMS_PER_PAGE = 8;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const response = await productAPI.search({
          categoryId: Number(category),
          page: currentPage,
          size: ITEMS_PER_PAGE,
        });

        console.log("[CategoryProducts] Full Axios Response:", response);
        console.log("[CategoryProducts] Response Data:", response.data);

        // Response interceptor đã extract response.data.data → response.data
        // Metadata được preserve trong response.__raw__.metadata
        const productsData = Array.isArray(response.data) ? response.data : [];
        const metadata = (response as any).__raw__?.metadata;

        console.log("[CategoryProducts] Products:", productsData);
        console.log("[CategoryProducts] Metadata:", metadata);

        setProducts(productsData);
        setTotalProducts(metadata?.totalElements ?? 0);
        setTotalPages(metadata?.totalPages ?? 1);
      } catch (err) {
        console.error("[CategoryProducts] Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage]);

  // Sort products on frontend
  const sortedProducts = [...products].sort((a, b) => {
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
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryTitle = (cat?: string) => {
    // Get from first product if available
    if (products.length > 0) {
      return products[0].tenDanhMuc || "Danh mục";
    }
    return "Danh mục";
  };

  if (loading) {
    return <PageLoader message="Đang tải sản phẩm..." />;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
          </li>
          {products.length > 0 && products[0].tenDanhMucCha && (
            <>
              <li>/</li>
              <li>
                <Link
                  to={`/category/${products[0].parentCategoryId}`}
                  className="hover:text-foreground transition-colors"
                >
                  {products[0].tenDanhMucCha}
                </Link>
              </li>
            </>
          )}
          {category && (
            <>
              <li>/</li>
              <li className="font-medium text-foreground">
                {getCategoryTitle(category)}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Header with Title & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-muted-foreground">
            Tìm thấy {totalProducts} sản phẩm
          </p>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
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
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Không tìm thấy sản phẩm nào trong danh mục này
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
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
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex flex-wrap gap-1 justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first, last, current, and adjacent pages
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
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
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
};

export default CategoryProducts;
