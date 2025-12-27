import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productAPI, type ProductResponse } from "@/services/product.api";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
  categoryName: string;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
  categoryName,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching related products for categoryId:", categoryId);
        const response = await productAPI.search({
          categoryId,
          size: 6, // Lấy 6 để filter ra current product
        });
        console.log("📦 Related products response:", response);
        console.log("📦 response.data:", response.data);
        // Filter out current product and limit to 5
        const filtered = response.data.data
          .filter((p) => p.productid !== currentProductId)
          .slice(0, 5);
        console.log("✅ Filtered products:", filtered);
        setProducts(filtered);
      } catch (error) {
        console.error("❌ Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} ngày`;
    return `${hours} giờ`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Đang tải...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Không có sản phẩm nào cùng chuyên mục
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <Link
              key={product.productid}
              to={`/products/${product.productid}`}
              className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.tenSanPham}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <Badge variant="secondary" className="gap-1 bg-white/90">
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(product.thoiGianKetThuc)}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
                  {product.tenSanPham}
                </h3>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Giá hiện tại</div>
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(product.giaHienTai)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
