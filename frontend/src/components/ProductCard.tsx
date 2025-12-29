import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { NewProductBadge } from "@/components/NewProductBadge";
import type { ProductResponse } from "@/services/product.api";

// Helper function to calculate time remaining
const getTimeRemaining = (endTime: string) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Đã kết thúc";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} ngày`;
  if (hours > 0) return `${hours} giờ`;
  return `${minutes} phút`;
};

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const timeRemaining = getTimeRemaining(product.thoiGianKetThuc);

  return (
    <Link to={`/products/${product.productid}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.tenSanPham}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          {/* NEW Badge */}
          {product.isHighlight && (
            <div className="absolute top-2 left-2">
              <NewProductBadge isHighlight={product.isHighlight} />
            </div>
          )}
          {/* Time Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 text-white backdrop-blur-sm text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeRemaining}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 sm:mb-3 group-hover:text-primary transition-colors">
            {product.tenSanPham}
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                Giá hiện tại
              </span>
              <span className="font-bold text-base sm:text-lg text-primary">
                {formatPrice(product.giaHienTai)}
              </span>
            </div>
            {product.giaMuaNgay && (
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">Mua ngay</span>
                <span className="font-medium">
                  {formatPrice(product.giaMuaNgay)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
