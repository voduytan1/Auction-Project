import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Clock, TrendingUp, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { watchlistAPI } from "@/services/watchlist.api";
import { productAPI, type ProductResponse } from "@/services/product.api";

export function WatchlistSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        // Get watchlist product IDs
        const watchlistResponse = await watchlistAPI.getWatchlist();
        const productIds = watchlistResponse.data?.data || [];

        if (productIds.length === 0) {
          setProducts([]);
          return;
        }

        // Fetch full product details
        const productPromises = productIds.map((id: number) =>
          productAPI.getById(id).then((res) => res.data)
        );

        const productsData = await Promise.all(productPromises);
        setProducts(productsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error("Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (productId: number) => {
    try {
      await watchlistAPI.removeFromWatchlist(productId);
      setProducts((prev) => prev.filter((p) => p.productid !== productId));
      setDeleteConfirmId(null);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch {
      toast.error("Lỗi khi xóa khỏi danh sách yêu thích");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  if (loading) {
    return <PageLoader message="Đang tải danh sách yêu thích..." />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
        <Heart className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Danh sách yêu thích trống</p>
        <p className="text-sm mb-6">Hãy thêm sản phẩm bạn quan tâm vào đây</p>
        <Button onClick={() => navigate("/")}>Khám phá ngay</Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card
            key={product.productid}
            className="group overflow-hidden hover:shadow-md transition-all duration-200 border-border/60"
          >
            {/* Layout Logic:
               - Mobile: Flex Col (Ảnh trên, Text dưới)
               - Desktop (sm): Flex Row (Ảnh trái, Text phải)
            */}
            <div className="flex flex-col sm:flex-row h-full">
              {/* === PRODUCT IMAGE === */}
              <div
                className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-muted cursor-pointer group-hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/products/${product.productid}`)}
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.tenSanPham}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Status Badge (Overlay on Image) */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={
                      product.trangThai === "ACTIVE" ? "default" : "secondary"
                    }
                    className="shadow-sm"
                  >
                    {product.trangThai === "ACTIVE"
                      ? "Đang diễn ra"
                      : product.trangThai === "COMPLETED"
                      ? "Đã kết thúc"
                      : product.trangThai}
                  </Badge>
                </div>
              </div>

              {/* === PRODUCT DETAILS === */}
              <div className="flex flex-1 flex-col p-4 gap-3">
                {/* Header: Title & Delete Button */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h3
                      className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => navigate(`/products/${product.productid}`)}
                    >
                      {product.tenSanPham}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{product.tenSeller}</span>
                    </div>
                  </div>

                  {/* Delete Button (Top Right) */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 -mt-1 -mr-1"
                    onClick={() => setDeleteConfirmId(product.productid)}
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Divider */}
                <div className="h-px bg-border sm:hidden" />

                {/* Footer: Stats & Action Button */}
                {/* Use mt-auto to push this section to bottom on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end mt-auto pt-2">
                  {/* Column 1: Price */}
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Giá hiện tại
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(product.giaHienTai)}
                    </p>
                  </div>

                  {/* Column 2: Time & Bids */}
                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <div
                      className={`flex items-center gap-2 text-sm font-medium ${
                        product.trangThai === "ACTIVE"
                          ? "text-orange-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeLeft(product.thoiGianKetThuc)}</span>
                    </div>

                    {product.soLuotRaGia !== undefined && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{product.soLuotRaGia} lượt trả giá</span>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Action Button */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <Button
                      className="w-full sm:w-auto font-semibold"
                      onClick={() => navigate(`/products/${product.productid}`)}
                      disabled={product.trangThai !== "ACTIVE"}
                    >
                      {product.trangThai === "ACTIVE"
                        ? "Đấu giá ngay"
                        : "Xem chi tiết"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khỏi danh sách yêu thích?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích
              không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteConfirmId && handleRemoveFromWatchlist(deleteConfirmId)
              }
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
