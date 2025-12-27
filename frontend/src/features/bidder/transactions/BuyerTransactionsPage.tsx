import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageLoader } from "@/components/PageLoader";
import { transactionAPI } from "@/services/transaction.api";
import { paymentAPI } from "@/services/payment.api";
import { ratingAPI } from "@/services/rating.api";
import { webSocketService } from "@/services/websocket";
import type { Transaction, TransactionStatus } from "@/types/transaction";
import type { TransactionStatusMessage } from "@/types/websocket";
import type { ApiResponse } from "@/types/types";
import { formatCurrency } from "@/lib/format";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Eye,
  MapPin,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Cập nhật lại màu sắc theo style SOLID (Nền đặc - Chữ trắng) như hình mẫu
const getStatusConfig = (status: TransactionStatus) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return {
        label: "Chờ thanh toán",
        className:
          "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent",
        icon: Clock,
      };
    case "PAYMENT_COMPLETED":
      return {
        label: "Đã thanh toán",
        className:
          "bg-green-500 hover:bg-green-600 text-white border-transparent",
        icon: CheckCircle,
      };
    case "AWAITING_SHIPMENT":
      return {
        label: "Chờ gửi hàng",
        className:
          "bg-blue-500 hover:bg-blue-600 text-white border-transparent",
        icon: Package,
      };
    case "SHIPPED":
      return {
        label: "Đã gửi hàng",
        className:
          "bg-indigo-500 hover:bg-indigo-600 text-white border-transparent",
        icon: Truck,
      };
    case "COMPLETED":
      return {
        label: "Hoàn tất",
        className:
          "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent",
        icon: CheckCircle,
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        className: "bg-red-500 hover:bg-red-600 text-white border-transparent",
        icon: XCircle,
      };
    default:
      return {
        label: status,
        className:
          "bg-gray-500 hover:bg-gray-600 text-white border-transparent",
        icon: Package,
      };
  }
};

export default function BuyerTransactionsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse<Transaction[]> | null>(
    null
  );
  const size = 10;

  // Address dialog state
  const [addressDialog, setAddressDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    address: string;
  }>({ open: false, transactionId: null, address: "" });

  // Confirm delivery dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    transactionId: number | null;
  }>({ open: false, transactionId: null });

  // Rating dialog state
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    sellerId: string | null;
    rating: 1 | -1 | null;
    comment: string;
  }>({
    open: false,
    transactionId: null,
    sellerId: null,
    rating: null,
    comment: "",
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await transactionAPI.getBuyerTransactions({ page, size });
      setResponse(result as any);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const transactions = response?.data || [];

  // Memoize transaction IDs to prevent unnecessary re-subscriptions
  const transactionIds = useMemo(
    () => transactions.map((t) => t.transactionId),
    [transactions.length, transactions.map((t) => t.transactionId).join(",")]
  );

  // Subscribe to WebSocket updates for all transactions
  useEffect(() => {
    if (transactionIds.length === 0) return;

    const subscriptionKeys: string[] = [];

    transactionIds.forEach((transactionId) => {
      const key = webSocketService.subscribeToTransactionStatus(
        transactionId,
        (message: TransactionStatusMessage) => {
          // Update status directly in state without full refresh
          setResponse((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: prev.data.map((t) =>
                t.transactionId === message.transactionId
                  ? { ...t, trangThai: message.trangThai }
                  : t
              ),
            };
          });
        }
      );
      subscriptionKeys.push(key);
    });

    return () => {
      subscriptionKeys.forEach((key) => webSocketService.unsubscribe(key));
    };
  }, [transactionIds]);

  const totalPages = response?.metadata ? response.metadata.totalPages : 0;

  const handlePayNow = async (transactionId: number) => {
    try {
      setProcessingId(transactionId);
      toast.loading("Đang tạo phiên thanh toán...");
      const result = await paymentAPI.createStripeCheckoutSession(
        transactionId
      );
      const url = result.data?.url;
      if (!url) throw new Error("Không nhận được URL thanh toán");
      toast.dismiss();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Lỗi: " + (error as Error).message);
      setProcessingId(null);
    }
  };

  const handleAddAddress = async () => {
    if (!addressDialog.transactionId || !addressDialog.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    try {
      setProcessingId(addressDialog.transactionId);
      await transactionAPI.addAddress(
        addressDialog.transactionId,
        addressDialog.address
      );
      toast.success("Đã cập nhật địa chỉ giao hàng");
      setAddressDialog({ open: false, transactionId: null, address: "" });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!confirmDialog.transactionId) return;

    try {
      setProcessingId(confirmDialog.transactionId);
      await transactionAPI.completeTransaction(confirmDialog.transactionId);
      toast.success("Đã xác nhận nhận hàng");
      setConfirmDialog({ open: false, transactionId: null });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSubmitRating = async () => {
    if (!ratingDialog.transactionId || !ratingDialog.sellerId) return;

    if (ratingDialog.rating === null) {
      toast.error("Vui lòng chọn đánh giá");
      return;
    }

    if (!ratingDialog.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }``

    try {
      setProcessingId(ratingDialog.transactionId);
      await ratingAPI.createRating({
        transactionId: ratingDialog.transactionId,
        rateeId: ratingDialog.sellerId,
        diem: ratingDialog.rating,
        nhanXet: ratingDialog.comment,
      });
      toast.success("Đã gửi đánh giá");
      setRatingDialog({
        open: false,
        transactionId: null,
        sellerId: null,
        rating: null,
        comment: "",
      });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  if (error) {
    return (
      <PageWrapper title="Giao dịch mua">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center text-red-500">
              Lỗi: {error.message}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Giao dịch mua">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6 gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Giao dịch mua của tôi</h1>
        </div>

        {loading ? (
          <PageLoader message="Đang tải giao dịch..." />
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              Chưa có giao dịch
            </CardContent>
          </Card>
        ) : (
          <>
            <TooltipProvider>
              <div className="space-y-3">
                {transactions.map((transaction: Transaction) => {
                  const statusConfig = getStatusConfig(transaction.trangThai);

                  return (
                    <Card
                      key={transaction.transactionId}
                      className="group hover:shadow-md transition-all"
                    >
                      <CardContent className="space-y-3">
                        {/* Hàng 1: Badge */}
                        <div className="flex items-center">
                          <Badge
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-md shadow-sm ${statusConfig.className}`}
                          >
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Hàng 2: Layout ngang */}
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-6 w-6 text-gray-500" />
                          </div>

                          {/* Thông tin chính */}
                          <div className="flex-1 min-w-0 grid gap-1">
                            <h3 className="font-semibold text-base truncate">
                              {transaction.tenSanPham ||
                                `Đơn hàng #${transaction.productId}`}
                            </h3>

                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>
                                Người bán:{" "}
                                {transaction.tenNguoiBan ||
                                  transaction.sellerId}
                              </span>
                              {transaction.maVanDon && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                  <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                                    #{transaction.maVanDon}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          {/* Giá tiền & Action */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary">
                                {formatCurrency(transaction.gia)}
                              </p>
                            </div>

                            {/* Action buttons based on status */}
                            <div className="flex items-center gap-2">
                              {/* Nút thanh toán */}
                              {transaction.trangThai === "PENDING_PAYMENT" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        handlePayNow(transaction.transactionId)
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                      disabled={
                                        processingId ===
                                        transaction.transactionId
                                      }
                                    >
                                      {processingId ===
                                      transaction.transactionId ? (
                                        <CreditCard className="h-4 w-4 animate-pulse" />
                                      ) : (
                                        <>
                                          <CreditCard className="h-4 w-4 mr-1.5" />
                                          Thanh toán
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Thanh toán qua Stripe</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Nút nhập địa chỉ */}
                              {transaction.trangThai ===
                                "PAYMENT_COMPLETED" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setAddressDialog({
                                          open: true,
                                          transactionId:
                                            transaction.transactionId,
                                          address:
                                            transaction.diaChiGiaoHang || "",
                                        })
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                      disabled={
                                        processingId ===
                                        transaction.transactionId
                                      }
                                    >
                                      {processingId ===
                                      transaction.transactionId ? (
                                        <MapPin className="h-4 w-4 animate-pulse" />
                                      ) : (
                                        <>
                                          <MapPin className="h-4 w-4 mr-1.5" />
                                          Nhập địa chỉ
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Cung cấp địa chỉ giao hàng</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Nút xác nhận nhận hàng */}
                              {transaction.trangThai === "SHIPPED" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setConfirmDialog({
                                          open: true,
                                          transactionId:
                                            transaction.transactionId,
                                        })
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                      disabled={
                                        processingId ===
                                        transaction.transactionId
                                      }
                                    >
                                      {processingId ===
                                      transaction.transactionId ? (
                                        <CheckCircle className="h-4 w-4 animate-pulse" />
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-1.5" />
                                          Xác nhận
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Xác nhận đã nhận hàng</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Nút đánh giá */}
                              {transaction.trangThai === "COMPLETED" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setRatingDialog({
                                          open: true,
                                          transactionId:
                                            transaction.transactionId,
                                          sellerId: transaction.sellerId,
                                          rating: null,
                                          comment: "",
                                        })
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                      disabled={
                                        processingId ===
                                        transaction.transactionId
                                      }
                                    >
                                      {processingId ===
                                      transaction.transactionId ? (
                                        <Star className="h-4 w-4 animate-pulse" />
                                      ) : (
                                        <>
                                          <Star className="h-4 w-4 mr-1.5" />
                                          Đánh giá
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Đánh giá người bán</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Nút xem chi tiết - luôn hiển thị */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() =>
                                      navigate(
                                        `/transactions/${transaction.transactionId}/detail`
                                      )
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="h-9 px-3 shadow-sm"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xem chi tiết giao dịch</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>{" "}
            </TooltipProvider>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Trang trước
                </Button>
                <div className="flex items-center px-4">
                  Trang {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Trang sau
                </Button>
              </div>
            )}

            {/* Address Dialog */}
            <Dialog
              open={addressDialog.open}
              onOpenChange={(open) =>
                setAddressDialog({ open, transactionId: null, address: "" })
              }
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nhập địa chỉ giao hàng</DialogTitle>
                  <DialogDescription>
                    Vui lòng cung cấp địa chỉ nhận hàng chi tiết
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ giao hàng</Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, tên đường, phường, quận, thành phố..."
                      value={addressDialog.address}
                      onChange={(e) =>
                        setAddressDialog((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAddressDialog({
                        open: false,
                        transactionId: null,
                        address: "",
                      })
                    }
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddAddress}
                    disabled={processingId === addressDialog.transactionId}
                  >
                    {processingId === addressDialog.transactionId
                      ? "Đang xử lý..."
                      : "Xác nhận"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirm Delivery Dialog */}
            <AlertDialog
              open={confirmDialog.open}
              onOpenChange={(open) =>
                setConfirmDialog({ open, transactionId: null })
              }
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đã nhận hàng?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn đã nhận hàng? Hành động này không thể hoàn
                    tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelivery}
                    disabled={processingId === confirmDialog.transactionId}
                  >
                    {processingId === confirmDialog.transactionId
                      ? "Đang xử lý..."
                      : "Xác nhận"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Rating Dialog */}
            <Dialog
              open={ratingDialog.open}
              onOpenChange={(open) =>
                setRatingDialog({
                  open,
                  transactionId: null,
                  sellerId: null,
                  rating: null,
                  comment: "",
                })
              }
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đánh giá người bán</DialogTitle>
                  <DialogDescription>
                    Vui lòng chọn đánh giá và nhập nhận xét của bạn
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Rating selection */}
                  <div className="space-y-2">
                    <Label>Chọn đánh giá</Label>
                    <div className="flex gap-4 justify-center">
                      <Button
                        type="button"
                        variant={
                          ratingDialog.rating === 1 ? "default" : "outline"
                        }
                        size="lg"
                        className="flex-1"
                        onClick={() =>
                          setRatingDialog((prev) => ({ ...prev, rating: 1 }))
                        }
                      >
                        <ThumbsUp className="h-6 w-6 mr-2" />
                        Tốt
                      </Button>
                      <Button
                        type="button"
                        variant={
                          ratingDialog.rating === -1 ? "default" : "outline"
                        }
                        size="lg"
                        className="flex-1"
                        onClick={() =>
                          setRatingDialog((prev) => ({ ...prev, rating: -1 }))
                        }
                      >
                        <ThumbsDown className="h-6 w-6 mr-2" />
                        Xấu
                      </Button>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <Label htmlFor="rating-comment">Nhận xét</Label>
                    <Textarea
                      id="rating-comment"
                      placeholder="Nhập nhận xét về người bán..."
                      value={ratingDialog.comment}
                      onChange={(e) =>
                        setRatingDialog((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setRatingDialog({
                        open: false,
                        transactionId: null,
                        sellerId: null,
                        rating: null,
                        comment: "",
                      })
                    }
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmitRating}
                    disabled={processingId === ratingDialog.transactionId}
                  >
                    {processingId === ratingDialog.transactionId
                      ? "Đang xử lý..."
                      : "Gửi đánh giá"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
