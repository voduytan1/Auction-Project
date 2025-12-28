import { Card, CardContent } from "@/components/ui/card";
import { Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "@/services/product.api";
import { formatPrice } from "../../../lib/format";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.productid}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
        <div className="aspect-4/3 relative overflow-hidden bg-linear-to-br from-muted to-muted/50">
          <img
            src={product.images?.[0]}
            alt={product.tenSanPham}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {product.tenSanPham}
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                Giá hiện tại
              </span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(product.giaHienTai)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span className="flex items-center gap-1">
                <Gavel className="h-3 w-3" />
                {product.tenSeller}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
