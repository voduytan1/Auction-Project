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
import { auctionAPI } from "@/services/auction.api";
import type { ApiErrorResponse } from "@/types/types";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAppSelector } from "@/hooks/use-redux";
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

// Utility: Extract order ID from buy now response
const extractOrderId = (data: unknown): string | number | null => {
  if (!data || typeof data !== "object") return null;

  const response = data as Record<string, unknown>;

  // Try bidHistory.bidHistoryid first (actual backend response)
  if (response.bidHistory && typeof response.bidHistory === "object") {
    const bidHistory = response.bidHistory as Record<string, unknown>;
    if (bidHistory.bidHistoryid)
      return bidHistory.bidHistoryid as string | number;
  }

  // Fallback to other possible fields
  const order = response.order as Record<string, unknown> | undefined;
  let orderId = response.orderId ?? response.id ?? order?.id ?? null;

  if (orderId && typeof orderId === "object") {
    const orderObj = orderId as Record<string, unknown>;
    orderId = orderObj.id ?? orderObj.orderId ?? null;
  }

  return orderId as string | number | null;
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
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | number | null>(
    null
  );
  const [buyNowResponse, setBuyNowResponse] = useState<unknown>(null);
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoValue, setAutoValue] = useState<string>("");

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
        <>
          <Button
            size="lg"
            className="flex-1 text-lg"
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
            <DialogContent>
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
                  placeholder={String(product.giaHienTai)}
                />
              </div>

              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button
                  onClick={async () => {
                    const parsed = Number(autoValue);
                    if (!parsed || parsed <= 0) {
                      alert("Vui lòng nhập mức giá hợp lệ");
                      return;
                    }
                    if (parsed < product.giaHienTai) {
                      if (
                        !confirm("Mức tối đa nhỏ hơn giá hiện tại. Tiếp tục?")
                      )
                        return;
                    }
                    try {
                      setAutoLoading(true);
                      await auctionAPI.createAutoBid({
                        productid: product.productid,
                        giaToiDa: parsed,
                      });
                      setAutoDialogOpen(false);
                      alert("Đặt giá tự động thành công");
                    } catch (error) {
                      console.error("Auto bid error", error);
                      const axiosError = error as AxiosError<ApiErrorResponse>;
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
              "flex-1 text-lg " +
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
              <AlertDialogContent>
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
                        const resp = await auctionAPI.buyNow(product.productid);
                        const orderId = extractOrderId(resp.data);

                        setBuyNowResponse(resp.data);
                        setCreatedOrderId(orderId);
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
                <div className="text-xs text-slate-600">Thời điểm đăng</div>
                <div className="font-semibold">
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
              <div className="flex items-center gap-3">
                {product.anhDaiDienSeller ? (
                  <img
                    src={product.anhDaiDienSeller}
                    alt={product.tenSeller}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="rounded-full bg-primary/10 p-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-600">Người bán</div>
                  <div className="font-semibold">
                    {product.tenSeller || "Người bán"}
                  </div>
                </div>
              </div>
              {product.diemDanhGiaSeller != null ? (
                <div className="flex items-center gap-1 text-accent">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-sm">
                    {product.diemDanhGiaSeller.toFixed(1)}/10
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Chưa có đánh giá</div>
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
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Đang dẫn đầu</div>
                    <div className="font-semibold">{product.tenBidder}</div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanh toán đơn hàng</DialogTitle>
            <DialogDescription>
              Đơn hàng đã được tạo thành công. Bạn có muốn thanh toán ngay bây
              giờ không?
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="mb-4">
              <div className="text-sm text-slate-600">Sản phẩm</div>
              <div className="font-semibold">{product.tenSanPham}</div>
              <div className="text-sm text-slate-600 mt-2">Giá</div>
              <div className="font-semibold">
                {formatCurrency(product.giaMuaNgay as number)}
              </div>
              {buyNowResponse ? (
                <div className="mt-2 text-sm text-slate-600">
                  Server: {extractResponseMessage(buyNowResponse)}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (createdOrderId) {
                    navigate(`/orders/${createdOrderId}/complete`);
                  } else {
                    navigate(`/profile`);
                  }
                }}
              >
                Thanh toán ngay
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setPaymentModalOpen(false);
                  navigate(`/profile`);
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
