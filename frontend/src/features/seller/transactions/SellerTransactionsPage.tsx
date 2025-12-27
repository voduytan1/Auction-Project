import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/PageLoader";
import { transactionAPI } from "@/services/transaction.api";
import { ratingAPI } from "@/services/rating.api";
import { webSocketService } from "@/services/websocket";
import type { Transaction, TransactionStatus } from "@/types/transaction";
import type { TransactionStatusMessage } from "@/types/websocket";
import type { ApiResponse } from "@/types/types";
import { formatCurrency } from "@/lib/format";
import {
  Store,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

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

export default function SellerTransactionsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse<Transaction[]> | null>(
    null
  );
  const size = 10;
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Tracking dialog state
  const [trackingDialog, setTrackingDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    tracking: string;
  }>({ open: false, transactionId: null, tracking: "" });

  // Rating dialog state
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    buyerId: string | null;
    rating: 1 | -1 | null;
    comment: string;
  }>({
    open: false,
    transactionId: null,
    buyerId: null,
    rating: null,
    comment: "",
  });

  // Fetch transactions with useCallback to avoid infinite loop
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await transactionAPI.getSellerTransactions({ page, size });
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

  const handleAddTracking = async () => {
    if (!trackingDialog.transactionId || !trackingDialog.tracking.trim()) {
      toast.error("Vui lòng nhập mã vận đơn");
      return;
    }

    try {
      setProcessingId(trackingDialog.transactionId);
      await transactionAPI.addShipmentProve(
        trackingDialog.transactionId,
        trackingDialog.tracking
      );
      toast.success("Đã cập nhật mã vận đơn");
      setTrackingDialog({ open: false, transactionId: null, tracking: "" });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSubmitRating = async () => {
    if (
      !ratingDialog.transactionId ||
      !ratingDialog.buyerId ||
      ratingDialog.rating === null
    ) {
      toast.error("Vui lòng chọn đánh giá");
      return;
    }

    if (!ratingDialog.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }

    try {
      setProcessingId(ratingDialog.transactionId);
      await ratingAPI.createRating({
        transactionId: ratingDialog.transactionId,
        rateeId: ratingDialog.buyerId,
        diem: ratingDialog.rating,
        nhanXet: ratingDialog.comment,
      });
      toast.success("Đã gửi đánh giá");
      setRatingDialog({
        open: false,
        transactionId: null,
        buyerId: null,
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
      <PageWrapper title="Giao dịch bán">
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
    <PageWrapper title="Giao dịch bán">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6 gap-3">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Giao dịch bán của tôi</h1>
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
                            <Store className="h-6 w-6 text-gray-500" />
                          </div>

                          {/* Thông tin chính */}
                          <div className="flex-1 min-w-0 grid gap-1">
                            <h3 className="font-semibold text-base truncate">
                              {transaction.tenSanPham ||
                                `Đơn hàng #${transaction.productId}`}
                            </h3>

                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>
                                Người mua:{" "}
                                {transaction.tenNguoiMua || transaction.buyerId}
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
                              {/* Nút cập nhật vận chuyển - chỉ khi đã có địa chỉ */}
                              {transaction.trangThai ===
                                "AWAITING_SHIPMENT" && (
                                <Button
                                  onClick={() =>
                                    setTrackingDialog({
                                      open: true,
                                      transactionId: transaction.transactionId,
                                      tracking: transaction.maVanDon || "",
                                    })
                                  }
                                  size="sm"
                                  className="h-9 px-4 shadow-sm"
                                  disabled={
                                    processingId === transaction.transactionId
                                  }
                                >
                                  {processingId ===
                                  transaction.transactionId ? (
                                    <Truck className="h-4 w-4 animate-pulse" />
                                  ) : (
                                    <>
                                      <Truck className="h-4 w-4 mr-1.5" />
                                      Cập nhật
                                    </>
                                  )}
                                </Button>
                              )}

                              {/* Nút đánh giá - sau khi hoàn tất */}
                              {transaction.trangThai === "COMPLETED" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setRatingDialog({
                                          open: true,
                                          transactionId:
                                            transaction.transactionId,
                                          buyerId: transaction.buyerId,
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
                                    <p>Đánh giá người mua</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Nút xem chi tiết - luôn hiển thị */}
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

            {/* Tracking Dialog */}
            <Dialog
              open={trackingDialog.open}
              onOpenChange={(open) =>
                setTrackingDialog({ open, transactionId: null, tracking: "" })
              }
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật mã vận đơn</DialogTitle>
                  <DialogDescription>
                    Vui lòng nhập mã vận đơn để cập nhật trạng thái giao hàng
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Mã vận đơn</Label>
                    <Input
                      id="tracking"
                      placeholder="Nhập mã vận đơn..."
                      value={trackingDialog.tracking}
                      onChange={(e) =>
                        setTrackingDialog((prev) => ({
                          ...prev,
                          tracking: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setTrackingDialog({
                        open: false,
                        transactionId: null,
                        tracking: "",
                      })
                    }
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddTracking}
                    disabled={processingId === trackingDialog.transactionId}
                  >
                    {processingId === trackingDialog.transactionId
                      ? "Đang xử lý..."
                      : "Xác nhận"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Rating Dialog */}
            <Dialog
              open={ratingDialog.open}
              onOpenChange={(open) =>
                setRatingDialog({
                  open,
                  transactionId: null,
                  buyerId: null,
                  rating: null,
                  comment: "",
                })
              }
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đánh giá người mua</DialogTitle>
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
                      placeholder="Nhập nhận xét về người mua..."
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
                        buyerId: null,
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
