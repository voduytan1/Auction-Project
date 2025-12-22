import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Sparkles, User, ShoppingCart } from "lucide-react";
import { formatCurrency, getTimeRemaining, isNewProduct } from "../helpers";
import type { Product } from "@/types/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isNew = isNewProduct(product.createdAt);
  const timeRemaining = getTimeRemaining(product.thoiGianKetThuc);

  return (
    <Link to={`/products/${product.productid}`} className="group">
      <Card
        className={`overflow-hidden transition-all hover:shadow-lg ${
          isNew ? "ring-2 ring-yellow-400 shadow-yellow-100" : ""
        }`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.anhDaiDien || "/placeholder.jpg"}
            alt={product.tenSanPham}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
          {isNew && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
              <Sparkles className="h-3 w-3 mr-1" />
              Mới đăng
            </Badge>
          )}
          {product.giaMuaNgay && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Mua ngay
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.tenSanPham}
          </h3>

          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {product.category.tenDanhMuc}
          </Badge>

          {/* Current Price */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Giá hiện tại</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(product.giaHienTai)}
            </div>
          </div>

          {/* Buy Now Price */}
          {product.giaMuaNgay && (
            <div className="text-sm text-muted-foreground">
              Mua ngay:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(product.giaMuaNgay)}
              </span>
            </div>
          )}

          {/* Current Bidder */}
          {product.currentBidder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="truncate">
                {product.currentBidder.hoVaTen ||
                  product.currentBidder.username}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{product.soLuotRaGia} lượt</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeRemaining}</span>
            </div>
          </div>

          {/* Posted date */}
          <div className="text-xs text-muted-foreground">
            Đăng: {new Date(product.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </Card>
    </Link>
  );
}
