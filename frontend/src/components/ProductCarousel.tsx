import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "@/services/product.api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  products: ProductResponse[];
  showControls?: boolean;
  variant?: "default" | "ending-soon" | "most-bids";
}

export function ProductCarousel({
  products,
  showControls = true,
  variant = "default",
}: ProductCarouselProps) {
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

  if (products.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem
            key={product.productid}
            className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <Link
              to={`/products/${product.productid}`}
              className={`group block overflow-hidden rounded-lg border transition-all hover:shadow-lg h-full ${
                variant === "ending-soon"
                  ? "border-2 border-red-300 hover:border-red-500"
                  : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.tenSanPham}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Badge đặc biệt cho ending soon */}
                {variant === "ending-soon" && (
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 text-xs font-bold animate-pulse">
                    SẮP KẾT THÚC
                  </div>
                )}
                <div
                  className={`absolute ${
                    variant === "ending-soon" ? "bottom-2" : "top-2"
                  } right-2`}
                >
                  <Badge
                    variant="secondary"
                    className={`gap-1 text-xs ${
                      variant === "ending-soon"
                        ? "bg-red-600 text-white font-bold shadow-lg"
                        : "bg-white/90"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(product.thoiGianKetThuc)}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1 p-2">
                <h3
                  className={`line-clamp-2 text-xs sm:text-sm font-semibold min-h-10 ${
                    variant === "ending-soon"
                      ? "group-hover:text-red-600"
                      : "group-hover:text-primary"
                  }`}
                >
                  {product.tenSanPham}
                </h3>
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-500">
                    Giá hiện tại
                  </div>
                  <div
                    className={`text-sm sm:text-base font-bold ${
                      variant === "ending-soon"
                        ? "text-red-600"
                        : "text-primary"
                    }`}
                  >
                    {formatCurrency(product.giaHienTai)}
                  </div>
                </div>
                {/* Show bid count for most-bids variant */}
                {variant === "most-bids" &&
                  product.soLuotRaGia !== undefined && (
                    <div className="flex items-center gap-1 pt-1 text-orange-600">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <span className="text-[10px] sm:text-xs font-semibold">
                        {product.soLuotRaGia} lượt
                      </span>
                    </div>
                  )}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && (
        <>
          <CarouselPrevious className="lg:hidden -left-4 h-10 w-10 border-2 hover:bg-primary hover:text-white" />
          <CarouselNext className="lg:hidden -right-4 h-10 w-10 border-2 hover:bg-primary hover:text-white" />
        </>
      )}
    </Carousel>
  );
}
