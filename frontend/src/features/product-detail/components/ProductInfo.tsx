import {
  Clock,
  Gavel,
  Tag,
  TrendingUp,
  User,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProductDetail } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductInfoProps {
  product: ProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getTimeRemaining = () => {
    const endDate = new Date(product.endTime);
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Nếu < 3 ngày thì hiển thị relative time
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

  const getRatingPercent = (user: { rating: number; totalRatings: number }) => {
    return `${user.rating.toFixed(1)}/10 (${user.totalRatings} đánh giá)`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Category */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <Tag className="h-4 w-4" />
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.subcategory}</span>
        </div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      {/* Price Info */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-600">Giá hiện tại</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.currentBid)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {product.totalBids} lượt ra giá
                </Badge>
              </div>
            </div>

            {product.buyNowPrice && (
              <div>
                <div className="text-sm text-slate-600">Giá mua ngay</div>
                <div className="text-2xl font-semibold text-accent">
                  {formatCurrency(product.buyNowPrice)}
                </div>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600">Giá khởi điểm</div>
                <div className="font-semibold">
                  {formatCurrency(product.startingPrice)}
                </div>
              </div>
              <div>
                <div className="text-slate-600">Bước giá</div>
                <div className="font-semibold">
                  {formatCurrency(product.bidIncrement)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {formatDistanceToNow(new Date(product.postedAt), {
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
                  <div className="font-semibold">{product.seller.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">
                  {getRatingPercent(product.seller)}
                </span>
              </div>
            </div>

            {product.highestBidder && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-accent/10 p-3">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-600">
                        Người đặt giá cao nhất
                      </div>
                      <div className="font-semibold">
                        {product.highestBidder.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">
                      {getRatingPercent(product.highestBidder)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full text-lg">
          <Gavel className="mr-2 h-5 w-5" />
          Đặt giá ngay
        </Button>
        {product.buyNowPrice && (
          <Button
            size="lg"
            variant="default"
            className="w-full bg-accent text-lg hover:bg-accent/90"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Mua ngay - {formatCurrency(product.buyNowPrice)}
          </Button>
        )}
      </div>

      {/* Auto Renew Badge */}
      {product.autoRenew && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Tự động gia hạn:</span>
          </div>
          <p className="mt-1 text-xs">
            Nếu có lượt đấu giá mới trong 5 phút cuối, sản phẩm tự động gia hạn
            thêm 10 phút.
          </p>
        </div>
      )}
    </div>
  );
}
