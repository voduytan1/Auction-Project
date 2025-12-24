import {
  Clock,
  Gavel,
  TrendingUp,
  User,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Import thêm Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { ProductResponse } from "@/services/product.api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductInfoProps {
  product: ProductResponse;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTimeRemaining = () => {
    const endDate = new Date(product.thoiGianKetThuc);
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 3) {
      return formatDistanceToNow(endDate, { addSuffix: true, locale: vi });
    }

    return endDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Category */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{product.tenSanPham}</h1>
      </div>

      {/* Price Info */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-600">Giá hiện tại</div>
              <div className="text-4xl font-bold text-primary leading-none my-1">
                {formatCurrency(product.giaHienTai)}
              </div>
              <Badge variant="secondary" className="text-xs mt-2">
                <TrendingUp className="mr-1 h-3 w-3" />
                156 lượt ra giá
              </Badge>
            </div>

            {product.giaMuaNgay && (
              <div>
                <div className="text-sm text-slate-600">Giá mua ngay</div>
                <div className="text-2xl font-semibold text-accent leading-none my-1">
                  {formatCurrency(product.giaMuaNgay)}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-600">Giá khởi điểm</div>
              <div className="font-semibold">
                {formatCurrency(product.giaKhoiDiem)}
              </div>
            </div>
            <div>
              <div className="text-slate-600">Bước giá</div>
              <div className="font-semibold">
                {formatCurrency(product.buocGia)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Đã chỉnh sửa */}
      <div className="flex items-stretch gap-3">
        {/* Nút Đặt giá - Luôn hiện và giãn rộng */}
        <Button size="lg" className="flex-1 text-lg">
          <Gavel className="mr-2 h-5 w-5" />
          Đặt giá 
        </Button>

        {/* Nút Mua ngay - Nếu có thì giãn rộng cùng nút Đặt giá */}
        {product.giaMuaNgay && (
          <Button
            size="lg"
            variant="default"
            className="flex-1 bg-accent text-lg hover:bg-accent/90"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Mua ngay
          </Button>
        )}

        {/* Nút Wishlist - Icon Only với Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg" // Dùng size lg để chiều cao bằng các nút bên cạnh
                className="aspect-square px-0" // aspect-square để thành hình vuông
              >
                <Heart className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm vào yêu thích</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Time Info */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 p-3">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Thời gian còn lại</div>
                <div className="font-semibold">{getTimeRemaining()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 p-3">
                <Gavel className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="text-xs text-slate-600">Đã đăng</div>
                <div className="font-semibold">
                  {formatDistanceToNow(new Date(product.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seller Info */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-slate-600">Người bán</div>
                  <div className="font-semibold">
                    {product.tenSeller || "Người bán"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-sm">9.5/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}