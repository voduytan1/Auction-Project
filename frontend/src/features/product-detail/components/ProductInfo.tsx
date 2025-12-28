import {
  Clock,
  Gavel,
  TrendingUp,
  User,
  Star,
  ShoppingCart,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { bidAPI } from "@/services/bid.api";
import { paymentAPI } from "@/services/payment.api";
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

// Utility: Extract transactionId from buy now response
const extractTransactionId = (data: unknown): number | null => {
  if (!data || typeof data !== "object") return null;

  const response = data as Record<string, unknown>;

  // Try transactionId first (new backend response)
  if (response.transactionId) {
    return response.transactionId as number;
  }

  // Try bidHistory.bidHistoryid (legacy)
  if (response.bidHistory && typeof response.bidHistory === "object") {
    const bidHistory = response.bidHistory as Record<string, unknown>;
    if (bidHistory.bidHistoryid) return bidHistory.bidHistoryid as number;
  }

  return null;
};

// Utility: Extract message from response
const extractResponseMessage = (response: unknown): string => {
  if (response && typeof response === "object") {
    const resp = response as { message?: string };
    if (resp.message) return resp.message;
  }
  return JSON.stringify(response);
};

interface ProductInfoProps {
  product: ProductResponse;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  // Check if user is seller or winner (for completed products)
  const isSeller =
    product.sellerId && user?.userid
      ? String(product.sellerId) === String(user.userid)
      : false;
  const isWinner =
    product.bidderId && user?.userid
      ? String(product.bidderId) === String(user.userid)
      : false;

  // Show completed card for:
  // - Not logged in users when product is completed
  // - Logged in users who are NOT seller or winner
  const isCompletedForOthers =
    product.trangThai === "COMPLETED" &&
    (!isAuthenticated || (!isSeller && !isWinner));
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [buyNowResponse, setBuyNowResponse] = useState<unknown>(null);
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

      {/* Action Buttons OR Completed Card */}
      {isCompletedForOthers ? (
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
                    type="number"
                    value={autoValue}
                    onChange={(e) => setAutoValue(e.target.value)}
                    placeholder={String(product.giaHienTai + product.buocGia)}
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
                      <div className="text-orange-600 font-medium">
                        ⚠️ Nếu giá ≥ {formatCurrency(product.giaMuaNgay)} → Mua
                        ngay tự động
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <Button
                    onClick={async () => {
                      const parsed = Number(autoValue);
                      if (!parsed || parsed <= 0) {
                        alert("Vui lòng nhập mức giá hợp lệ");
                        return;
                      }

                      // Validate giá tối thiểu
                      const minRequired = product.giaHienTai + product.buocGia;
                      if (parsed < minRequired) {
                        alert(
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
                        alert(
                          `Giá phải có dạng: giá hiện tại + n × bước giá.\nGợi ý: ${formatCurrency(
                            suggested
                          )}`
                        );
                        return;
                      }

                      // Cảnh báo nếu >= giá mua ngay
                      if (product.giaMuaNgay && parsed >= product.giaMuaNgay) {
                        if (
                          !confirm(
                            `Giá tối đa của bạn (${formatCurrency(
                              parsed
                            )}) ≥ giá mua ngay (${formatCurrency(
                              product.giaMuaNgay
                            )}).\n\nSản phẩm sẽ được MUA NGAY TỰ ĐỘNG!\n\nBạn có chắc chắn muốn tiếp tục?`
                          )
                        ) {
                          return;
                        }
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
                          // Trường hợp mua ngay
                          setTransactionId(txId);
                          setPaymentModalOpen(true);
                        } else {
                          // Trường hợp đặt giá tự động bình thường
                          toast.success("Đặt giá tự động thành công!");
                          // Reload lại product để cập nhật giá hiện tại
                          window.location.reload();
                        }
                      } catch (error) {
                        console.error("Auto bid error", error);
                        const axiosError =
                          error as AxiosError<ApiErrorResponse>;
                        alert(
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
                          const resp = await bidAPI.buyNow(product.productid);
                          const txId = extractTransactionId(resp.data);

                          setBuyNowResponse(resp.data);
                          setTransactionId(txId);
                          setBuyDialogOpen(false);
                          setPaymentModalOpen(true);
                        } catch (error) {
                          console.error("Buy now error:", error);
                          const axiosError =
                            error as AxiosError<ApiErrorResponse>;
                          alert(
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
              <div className="flex items-center gap-3 min-w-0">
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
                <div className="min-w-0">
                  <div className="text-xs text-slate-600">Người bán</div>
                  <div className="font-semibold truncate">
                    {product.tenSeller || "Người bán"}
                  </div>
                </div>
              </div>
              {product.diemDanhGiaSeller != null ? (
                <div className="flex items-center gap-1 text-accent shrink-0">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-sm">
                    {product.diemDanhGiaSeller.toFixed(1)}/10
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
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-full bg-green-100 p-2 md:p-3 shrink-0">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-600">Đang dẫn đầu</div>
                    <div className="font-semibold truncate">
                      {product.tenBidder}
                    </div>
                  </div>
                </div>
                {product.diemDanhGiaBidder != null ? (
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-sm">
                      {product.diemDanhGiaBidder.toFixed(1)}/10
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">Chưa có đánh giá</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment decision modal shown after buyNow response */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="w-[95vw] max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Mua thành công!</DialogTitle>
            <DialogDescription>
              Chúc mừng! Bạn đã mua sản phẩm thành công.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="mb-4">
              <div className="text-sm text-slate-600">Sản phẩm</div>
              <div className="font-semibold truncate">{product.tenSanPham}</div>
              <div className="text-sm text-slate-600 mt-2">Giá mua</div>
              <div className="font-semibold text-accent">
                {formatCurrency(product.giaMuaNgay as number)}
              </div>
              {buyNowResponse ? (
                <div className="mt-2 text-sm text-green-600 wrap-break-words">
                  {extractResponseMessage(buyNowResponse)}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1"
                onClick={async () => {
                  if (!transactionId) {
                    alert("Không tìm thấy thông tin giao dịch");
                    return;
                  }

                  try {
                    toast.loading("Đang tạo phiên thanh toán...");
                    const response =
                      await paymentAPI.createStripeCheckoutSession(
                        transactionId
                      );
                    const url = response.data?.url;
                    toast.dismiss();
                    toast.success("Chuyển hướng đến trang thanh toán...");
                    window.location.href = url;
                  } catch (error) {
                    toast.dismiss();
                    toast.error(
                      "Lỗi khi tạo phiên thanh toán: " +
                        (error as Error).message
                    );
                  }
                }}
                disabled={!transactionId}
              >
                Thanh toán ngay
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPaymentModalOpen(false);
                  toast.info(
                    "Bạn có thể thanh toán sau trong mục Giao dịch mua"
                  );
                  navigate(`/bidder/purchases`);
                }}
              >
                Thanh toán sau
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
