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
import type { ProductResponse } from "@/services/product.api";

export function WatchlistSection() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const size = 10;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        // Get watchlist with full product details
        const response = await watchlistAPI.getWatchlistWithProducts({
          page,
          size,
        });
        const watchlistItems = response.data || [];

        // Extract products from watchlist items
        const productsData = watchlistItems.map((item) => item.product);
        setProducts(productsData);

        // Get metadata from __raw__
        const metadata = (response as any).__raw__?.metadata;
        setTotalPages(metadata?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error("Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [page, size]);

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
      <div className="text-center py-12 text-muted-foreground">
        <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Danh sách yêu thích trống</p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 -mx-6 px-6">
        {products.map((product) => (
          <Card
            key={product.productid}
            className="group hover:shadow-md transition-all duration-200 border-border/60"
          >
            {/* SỬA 1: Thêm p-3 hoặc p-4 vào đây để tạo khoảng hở với viền Card */}
            <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4 gap-3 sm:gap-4">
              {/* === PRODUCT IMAGE === */}
              <div
                // SỬA 2: Thêm rounded-md và overflow-hidden để bo góc ảnh
                // Xóa bg-muted nếu muốn (hoặc giữ để load placeholder)
                className="relative w-full sm:w-32 md:w-36 lg:w-40 h-40 sm:h-32 md:h-36 lg:h-40 shrink-0 bg-muted rounded-md overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity"
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

                {/* Status Badge */}
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
              {/* SỬA 3: Xóa padding ở đây đi (vì cha đã có p-4 rồi), chỉ giữ lại flex-col và gap */}
              <div className="flex flex-1 flex-col gap-2">
                {/* Header: Title & Delete Button */}
                <div className="flex justify-between items-start gap-2 sm:gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3
                      className="font-semibold text-base sm:text-lg md:text-xl line-clamp-2 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => navigate(`/products/${product.productid}`)}
                    >
                      {product.tenSanPham}
                    </h3>

                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{product.tenSeller}</span>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    // Chỉnh lại margin nút xóa xíu cho đẹp
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 -mr-2 -mt-2"
                    onClick={() => setDeleteConfirmId(product.productid)}
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Divider (Giữ nguyên hoặc xóa tùy thích) */}
                <div className="h-px bg-border sm:hidden my-1" />

                {/* Footer: Stats & Action Button */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-end mt-auto">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Giá hiện tại
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary truncate">
                      {formatPrice(product.giaHienTai)}
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-1 sm:space-y-1.5">
                    <div
                      className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${
                        product.trangThai === "ACTIVE"
                          ? "text-orange-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {formatTimeLeft(product.thoiGianKetThuc)}
                      </span>
                    </div>

                    {product.soLuotRaGia !== undefined && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span className="truncate">
                          {product.soLuotRaGia} lượt trả giá
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex justify-end">
                    <Button
                      className="w-full sm:w-auto md:min-w-35 lg:min-w-40 font-semibold text-sm md:text-base"
                      onClick={() => navigate(`/products/${product.productid}`)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            size="sm"
            className="w-full sm:w-auto text-sm"
          >
            Trang trước
          </Button>
          <div className="flex items-center px-3 sm:px-4 text-xs sm:text-sm">
            Trang {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            size="sm"
            className="w-full sm:w-auto text-sm"
          >
            Trang sau
          </Button>
        </div>
      )}

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
