import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { categoryProducts } from "@/data/mock-data";
import { NewProductBadge } from "@/components/NewProductBadge";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState("ending-soon");

  // TODO: Fetch products from API based on category
  const products = categoryProducts;

  // Pagination logic
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryTitle = (cat?: string) => {
    const titles: Record<string, string> = {
      electronics: "Điện tử",
      fashion: "Thời trang",
      home: "Nhà cửa & Đời sống",
      sports: "Thể thao & Giải trí",
      books: "Sách & Văn phòng phẩm",
      toys: "Đồ chơi",
      other: "Khác",
    };
    return titles[cat || ""] || "Tất cả sản phẩm";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/products"
              className="hover:text-foreground transition-colors"
            >
              Sản phẩm
            </Link>
          </li>
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

      {/* Header with Title & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-muted-foreground">
            Tìm thấy {products.length} sản phẩm
          </p>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ending-soon">Sắp kết thúc</SelectItem>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
            <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
            <SelectItem value="most-bids">Nhiều lượt đấu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {currentProducts.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                {/* NEW Badge */}
                {product.createdAt && (
                  <div className="absolute top-2 left-2">
                    <NewProductBadge createdAt={product.createdAt} />
                  </div>
                )}
                {/* Time Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white backdrop-blur-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {product.endTime}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">
                      Giá hiện tại
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(product.currentBid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {product.bids} lượt đấu
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="flex items-center px-2">
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
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Hiển thị {startIndex + 1}-{Math.min(endIndex, products.length)} trong
        tổng số {products.length} sản phẩm
      </p>
    </div>
  );
};

export default CategoryProducts;
