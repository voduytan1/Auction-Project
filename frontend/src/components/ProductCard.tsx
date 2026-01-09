import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Heart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { NewProductBadge } from "@/components/NewProductBadge";
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog";
import type { ProductResponse } from "@/services/product.api";
import { watchlistAPI } from "@/services/watchlist.api";
import { useAppSelector } from "@/hooks/use-redux";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Check if product is in watchlist on mount
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await watchlistAPI.getWatchlist();
        const ids: number[] = Array.isArray(response.data) ? response.data : [];
        setIsInWatchlist(ids.includes(product.productid));
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [product.productid, isAuthenticated]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setWatchlistLoading(true);
      if (isInWatchlist) {
        await watchlistAPI.removeFromWatchlist(product.productid);
        setIsInWatchlist(false);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await watchlistAPI.addToWatchlist(product.productid);
        setIsInWatchlist(true);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      toast.error("Lỗi khi cập nhật danh sách yêu thích");
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full relative">
        {/* CANCELLED Overlay */}
        {product.trangThai === "CANCELLED" && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ĐÃ HỦY
            </Badge>
          </div>
        )}

        {/* Image - Clickable */}
        <Link to={`/products/${product.productid}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-muted group">
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
        </Link>

        {/* Watchlist Button - Absolute positioned outside image Link */}
        <div className="absolute top-[calc(100%-12rem)] right-2 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
            onClick={handleWatchlistToggle}
            disabled={watchlistLoading}
            title={isInWatchlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWatchlist ? "text-red-500 fill-red-500" : "text-slate-600"
              }`}
            />
          </Button>
        </div>

        <CardContent className="p-3 sm:p-4">
          {/* Title - Clickable */}
          <Link to={`/products/${product.productid}`}>
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 min-h-10 sm:min-h-12 mb-2 sm:mb-3 hover:text-primary transition-colors">
              {product.tenSanPham}
            </h3>
          </Link>

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
            {/* Người giữ giá (masked) và số lượt bid */}
            <div className="flex items-center justify-between text-xs pt-1 border-t">
              {product.tenBidder ? (
                <span className="text-muted-foreground truncate flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  {product.tenBidder}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Chưa có người đấu giá
                </span>
              )}
              {product.soLuotRaGia !== undefined && (
                <span className="text-muted-foreground font-medium">
                  {product.soLuotRaGia} lượt
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích."
      />
    </>
  );
}
