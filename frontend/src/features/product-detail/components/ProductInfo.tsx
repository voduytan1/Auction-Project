import {
  Clock,
  Gavel,
  TrendingUp,
  User,
  Star,
  ShoppingCart,
  Heart,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
// Import thêm Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { ProductResponse } from "@/services/product.api";
import { bidAPI } from "@/services/bid.api";
import { watchlistAPI } from "@/services/watchlist.api";
import type { ApiErrorResponse } from "@/types/types";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/use-redux";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";

// Utility: Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format number with comma separator
const formatNumber = (value: number | string | undefined): string => {
  if (!value) return "";
  const numValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(numValue)) return "";
  return numValue.toLocaleString("en-US");
};

// Parse formatted string to number
const parseNumber = (value: string): number | undefined => {
  if (!value) return undefined;
  const numValue = parseFloat(value.replace(/,/g, ""));
  return isNaN(numValue) ? undefined : numValue;
};

interface ProductInfoProps {
  product: ProductResponse;
  onRefreshProduct?: () => Promise<void>;
  onProductUpdate?: (updates: Partial<ProductResponse>) => void;
}

export function ProductInfo({
  product,
  onRefreshProduct,
  onProductUpdate,
}: ProductInfoProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  // Show completed card for ALL users when product is completed
  const isCompleted = product.trangThai === "COMPLETED";
  const isCancelled = product.trangThai === "CANCELLED";

  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoValue, setAutoValue] = useState<string>("");
  const [, setAutoBidResponse] = useState<unknown>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Check if product is in watchlist on load
  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await watchlistAPI.getWatchlist();
        const ids: number[] = Array.isArray(response.data) ? response.data : [];
        setIsInWatchlist(ids.includes(product.productid));
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [product.productid]);

  const getTimeRemaining = () => {
    const endDate = new Date(product.thoiGianKetThuc);
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();

    // Nếu đã hết hạn
    if (diffInMs <= 0) {
      return "Đã kết thúc";
    }

    // Nếu còn ít hơn 3 ngày -> hiển thị relative
    const days = differenceInDays(endDate, now);
    if (days < 3) {
      return formatDistanceToNow(endDate, { addSuffix: true, locale: vi });
    }

    // Nếu >= 3 ngày -> hiển thị ngày giờ đầy đủ
    return format(endDate, "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const handleWatchlistToggle = async () => {
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
    <div className="space-y-6">
      {/* Title & Category */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold wrap-break-words">
          {product.tenSanPham}
        </h1>
      </div>

      {/* Price Info */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <div className="text-sm text-slate-600">Giá hiện tại</div>
              <div className="text-2xl md:text-3xl font-bold text-primary leading-none my-1">
                {formatCurrency(product.giaHienTai)}
              </div>
            </div>

            {product.giaMuaNgay && (
              <div className="md:text-left border-t md:border-t-0 pt-4 md:pt-0 border-dashed border-slate-300">
                <div className="text-sm text-slate-600">Giá mua ngay</div>
                <div className="text-2xl md:text-3xl font-bold text-accent leading-none my-1">
                  {formatCurrency(product.giaMuaNgay)}
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-600">Giá khởi điểm</div>
              <div className="font-semibold">
                {formatCurrency(product.giaKhoiDiem)}
              </div>
            </div>
            <div className="md:text-left">
              <div className="text-slate-600">Bước giá</div>
              <div className="font-semibold">
                {formatCurrency(product.buocGia)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons OR Completed/Cancelled Card */}
      {isCancelled ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Sản phẩm đã bị hủy</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Sản phẩm này đã bị người bán hoặc quản trị viên hủy.
            </p>
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-slate-600">
                Phiên đấu giá không còn hoạt động. Vui lòng xem các sản phẩm
                khác.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isCompleted ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Sản phẩm đã kết thúc</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Phiên đấu giá cho sản phẩm này đã kết thúc.
            </p>
            <div className="space-y-3 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-slate-600">Giá cuối cùng:</span>
                <span className="font-semibold text-accent text-lg">
                  {formatCurrency(product.giaHienTai)}
                </span>
              </div>
              {product.tenBidder && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Người thắng:</span>
                  <span className="font-semibold">{product.tenBidder}</span>
                </div>
              )}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                Sản phẩm này đã được bán thành công. Cảm ơn bạn đã quan tâm!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Nút Đặt giá - Luôn hiện và giãn rộng */}
          <>
            <Button
              size="lg"
              className="flex-1 text-base md:text-lg py-6 sm:py-0"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/auth/login");
                  return;
                }
                setAutoDialogOpen(true);
              }}
            >
              <Gavel className="mr-2 h-5 w-5" />
              Đặt giá tự động
            </Button>

            <Dialog open={autoDialogOpen} onOpenChange={setAutoDialogOpen}>
              <DialogContent className="w-[95vw] max-w-lg rounded-lg">
                <DialogHeader>
                  <DialogTitle>Thiết lập đặt giá tự động</DialogTitle>
                  <DialogDescription>
                    Nhập mức giá tối đa bạn muốn hệ thống tự động đặt thay cho
                    bạn.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2">
                  <label className="block text-sm text-slate-600 mb-2">
                    Mức giá tối đa (VND)
                  </label>
                  <Input
                    type="text"
                    value={formatNumber(autoValue)}
                    onChange={(e) => {
                      const numValue = parseNumber(e.target.value);
                      setAutoValue(numValue ? String(numValue) : "");
                    }}
                    placeholder={formatNumber(
                      product.giaHienTai + product.buocGia
                    )}
                  />
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div>
                      Giá hiện tại: {formatCurrency(product.giaHienTai)}
                    </div>
                    <div>Bước giá: {formatCurrency(product.buocGia)}</div>
                    <div className="text-primary font-medium">
                      Giá tối thiểu:{" "}
                      {formatCurrency(product.giaHienTai + product.buocGia)}
                    </div>
                    {product.giaMuaNgay && (
                      <div className="text-orange-600 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Nếu giá ≥ {formatCurrency(product.giaMuaNgay)} → Mua
                        ngay
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <Button
                    className="ml-2"
                    onClick={async () => {
                      const parsed = Number(autoValue);
                      if (!parsed || parsed <= 0) {
                        toast.error("Vui lòng nhập mức giá hợp lệ");
                        return;
                      }

                      // Validate giá tối thiểu
                      const minRequired = product.giaHienTai + product.buocGia;
                      if (parsed < minRequired) {
                        toast.error(
                          `Giá tối đa phải ≥ ${formatCurrency(
                            minRequired
                          )} (giá hiện tại + bước giá)`
                        );
                        return;
                      }

                      // Validate giá phải là bội số của bước giá
                      const difference = parsed - product.giaHienTai;
                      if (difference % product.buocGia !== 0) {
                        const suggested =
                          product.giaHienTai +
                          Math.ceil(difference / product.buocGia) *
                            product.buocGia;
                        toast.error(
                          `Giá phải có dạng: giá hiện tại + n × bước giá.\nGợi ý: ${formatCurrency(
                            suggested
                          )}`
                        );
                        return;
                      }

                      try {
                        setAutoLoading(true);
                        const resp = await bidAPI.createAutoBid({
                          productid: product.productid,
                          giaToiDa: parsed,
                        });

                        setAutoBidResponse(resp.data);
                        setAutoDialogOpen(false);

                        // Kiểm tra có transactionId không (mua ngay)
                        const responseData = resp.data as {
                          data?: { transactionId?: number | null };
                        };
                        const txId = responseData?.data?.transactionId;

                        if (txId) {
                          // Trường hợp mua ngay (auto bid >= giá mua ngay)
                          toast.success(
                            "Đặt giá tự động thành công! Sản phẩm đã được mua ngay."
                          );

                          // Update product status immediately
                          if (onProductUpdate) {
                            onProductUpdate({
                              trangThai: "COMPLETED",
                              bidderId: user?.userid,
                              tenBidder: user?.hoVaTen || user?.email,
                            });
                          }
                        } else {
                          // Trường hợp đặt giá tự động bình thường
                          toast.success("Đặt giá tự động thành công!");
                          setAutoDialogOpen(false);
                          // Refetch product để cập nhật giá hiện tại thay vì reload
                          if (onRefreshProduct) {
                            await onRefreshProduct();
                          }
                        }
                      } catch (error) {
                        console.error("Auto bid error", error);
                        const axiosError =
                          error as AxiosError<ApiErrorResponse>;
                        toast.error(
                          axiosError.response?.data?.message ||
                            "Lỗi khi đặt giá tự động"
                        );
                      } finally {
                        setAutoLoading(false);
                      }
                    }}
                    disabled={autoLoading}
                  >
                    {autoLoading ? "Đang xử lý..." : "Đặt giá tự động"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>

          {/* Nút Mua ngay - Nếu có thì giãn rộng cùng nút Đặt giá */}
          <>
            <Button
              size="lg"
              variant="default"
              className={
                "flex-1 text-base md:text-lg py-6 sm:py-0 " +
                (product.giaMuaNgay
                  ? "bg-accent hover:bg-accent/90"
                  : "bg-accent cursor-not-allowed")
              }
              onClick={() => {
                if (!product.giaMuaNgay) return; // disabled
                if (!isAuthenticated) {
                  navigate("/auth/login");
                  return;
                }
                setBuyDialogOpen(true);
              }}
              disabled={!product.giaMuaNgay || buyLoading}
              title={product.giaMuaNgay ? "Mua ngay" : "Không có giá mua ngay"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Mua ngay
            </Button>

            {/* Buy Now confirmation dialog (only meaningful when price exists) */}
            {product.giaMuaNgay && (
              <AlertDialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                <AlertDialogContent className="w-[95vw] max-w-lg rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận mua ngay</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ mua sản phẩm này ngay với giá{" "}
                      {formatCurrency(product.giaMuaNgay as number)}.
                      <br />
                      Vui lòng xác nhận để tiếp tục.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={buyLoading}>
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          setBuyLoading(true);
                          await bidAPI.buyNow(product.productid);

                          setBuyDialogOpen(false);
                          toast.success(
                            "Mua ngay thành công! Vui lòng thanh toán."
                          );

                          // Update product status immediately after buy now success
                          if (onProductUpdate) {
                            onProductUpdate({
                              trangThai: "COMPLETED",
                              bidderId: user?.userid,
                              tenBidder: user?.hoVaTen || user?.email,
                            });
                          }
                        } catch (error) {
                          console.error("Buy now error:", error);
                          const axiosError =
                            error as AxiosError<ApiErrorResponse>;
                          toast.error(
                            axiosError.response?.data?.message ||
                              "Mua ngay thất bại"
                          );
                        } finally {
                          setBuyLoading(false);
                        }
                      }}
                    >
                      {buyLoading ? "Đang xử lý..." : "Xác nhận mua"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>

          {/* Nút Wishlist - Icon Only với Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="aspect-square px-0 w-full sm:w-auto py-6 sm:py-0"
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading || !isAuthenticated}
                  title={
                    !isAuthenticated
                      ? "Vui lòng đăng nhập"
                      : isInWatchlist
                      ? "Xóa khỏi yêu thích"
                      : "Thêm vào yêu thích"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWatchlist ? "text-red-500 fill-red-500" : ""
                    }`}
                  />
                  {/* Hiện text trên mobile cho nút này dễ hiểu hơn */}
                  <span className="ml-2 sm:hidden">Yêu thích</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {!isAuthenticated
                    ? "Vui lòng đăng nhập"
                    : isInWatchlist
                    ? "Xóa khỏi yêu thích"
                    : "Thêm vào yêu thích"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Time Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 p-3 shrink-0">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-600 truncate">
                  Thời gian còn lại
                </div>
                <div className="font-semibold truncate">
                  {getTimeRemaining()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 p-3 shrink-0">
                <Gavel className="h-5 w-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-600 truncate">
                  Thời điểm đăng
                </div>
                <div className="font-semibold truncate">
                  {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm", {
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
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {product.anhDaiDienSeller ? (
                  <img
                    src={product.anhDaiDienSeller}
                    alt={product.tenSeller}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="rounded-full bg-primary/10 p-2 md:p-3 shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-600">Người bán</div>
                  {product.sellerId ? (
                    <Link
                      to={`/users/${product.sellerId}/ratings`}
                      className="font-semibold truncate hover:text-primary transition-colors hover:underline"
                      title="Xem chi tiết đánh giá"
                    >
                      {product.tenSeller || "Người bán"}
                    </Link>
                  ) : (
                    <div className="font-semibold truncate">
                      {product.tenSeller || "Người bán"}
                    </div>
                  )}
                </div>
              </div>
              {product.diemDanhGiaSeller != null ? (
                <div className="flex items-center gap-1 text-accent shrink-0">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-sm">
                    {product.diemDanhGiaSeller.toFixed(0)}%
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 shrink-0">
                  Chưa có đánh giá
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highest Bidder Info */}
      {product.tenBidder && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="rounded-full bg-green-100 p-2 md:p-3 shrink-0">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-slate-600">Đang dẫn đầu</div>
                    {product.bidderId ? (
                      <Link
                        to={`/users/${product.bidderId}/ratings`}
                        className="font-semibold truncate hover:text-primary transition-colors hover:underline"
                        title="Xem chi tiết đánh giá"
                      >
                        {product.tenBidder}
                      </Link>
                    ) : (
                      <div className="font-semibold truncate">
                        {product.tenBidder}
                      </div>
                    )}
                  </div>
                </div>
                {product.diemDanhGiaBidder != null ? (
                  <div className="flex items-center gap-1 text-accent shrink-0">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-sm">
                      {product.diemDanhGiaBidder.toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 shrink-0">
                    Chưa có đánh giá
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
