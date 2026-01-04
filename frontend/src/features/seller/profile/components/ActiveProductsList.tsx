import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Package, Clock } from "lucide-react";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimplePagination } from "@/components/SimplePagination";

interface ActiveProductsListProps {
  sellerId: string;
}

export function ActiveProductsList({ sellerId }: ActiveProductsListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadProducts();
  }, [sellerId, currentPage]);

  const loadProducts = async () => {
    if (!sellerId) return;
    setIsLoading(true);
    try {
      const response = await productAPI.search({
        sellerId: sellerId,
        status: "ACTIVE",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: currentPage, // 1-based page number
        size: pageSize,
      });

      // Backend response is wrapped in ApiResponse, but interceptor extracts data
      const productsData = Array.isArray(response.data) ? response.data : [];
      setProducts(productsData);

      // Extract pagination info from __metadata__ (set by interceptor)
      const metadata = (response as any).__metadata__;
      if (metadata) {
        setTotalPages(metadata.totalPages || 0);
        setTotalElements(metadata.totalElements || 0);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-20 animate-pulse" />
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="mb-4">Bạn chưa có sản phẩm nào đang bán</p>
          <Button onClick={() => navigate("/seller/products/create")}>
            Đăng sản phẩm mới
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.productid}
                className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/products/${product.productid}`)}
              >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.tenSanPham}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">
                    {product.tenSanPham}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Kết thúc: {formatDate(product.thoiGianKetThuc)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Giá hiện tại
                      </p>
                      <p className="font-bold text-primary">
                        {formatCurrency(product.giaHienTai)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {product.soLuotRaGia || 0} lượt đặt giá
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <SimplePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={(page) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("page", page.toString());
              setSearchParams(newParams);
            }}
            itemName="sản phẩm"
          />
        </>
      )}
    </div>
  );
}
