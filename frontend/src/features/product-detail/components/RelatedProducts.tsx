import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeProduct } from "@/data/mock-data";

interface RelatedProductsProps {
  products: HomeProduct[];
  currentCategory: string;
}

export function RelatedProducts({
  products,
  currentCategory,
}: RelatedProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm cùng chuyên mục: {currentCategory}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <Badge variant="secondary" className="gap-1 bg-white/90">
                    <Clock className="h-3 w-3" />
                    {product.endTime}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
                  {product.name}
                </h3>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Giá hiện tại</div>
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(product.currentBid)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Gavel className="h-3 w-3" />
                    {product.bids}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
