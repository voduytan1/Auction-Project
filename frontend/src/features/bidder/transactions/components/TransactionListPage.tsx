import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { PageLoader } from "@/components/PageLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { TransactionCard } from "./TransactionCard";
import { RatingDialog } from "./RatingDialog";
import { transactionAPI } from "@/services/transaction.api";
import { ratingAPI } from "@/services/rating.api";
import { paymentAPI } from "@/services/payment.api";
import { webSocketService } from "@/services/websocket";
import type { Transaction } from "@/types/transaction";
import type { ApiResponse } from "@/types/types";
import type { TransactionStatusMessage } from "@/types/websocket";

interface TransactionListPageProps {
  role: "buyer" | "seller";
}

export function TransactionListPage({ role }: TransactionListPageProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse<Transaction[]> | null>(
    null
  );
  const [processingId, setProcessingId] = useState<number | null>(null);
  const size = 10;

  // Address dialog (buyer only)
  const [addressDialog, setAddressDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    address: string;
  }>({ open: false, transactionId: null, address: "" });

  // Tracking dialog (seller only)
  const [trackingDialog, setTrackingDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    tracking: string;
  }>({ open: false, transactionId: null, tracking: "" });

  // Confirm delivery dialog (buyer only)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    transactionId: number | null;
  }>({ open: false, transactionId: null });

  // Rating dialog
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    transactionId: number | null;
    otherPartyId: string | null;
  }>({ open: false, transactionId: null, otherPartyId: null });

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result =
        role === "buyer"
          ? await transactionAPI.getBuyerTransactions({ page, size })
          : await transactionAPI.getSellerTransactions({ page, size });
      setResponse(result as any);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [page, size, role]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const transactions = response?.data || [];
  const totalPages = response?.metadata ? response.metadata.totalPages : 0;

  // WebSocket subscriptions
  const transactionIds = useMemo(
    () => transactions.map((t: Transaction) => t.transactionId),
    [
      transactions.length,
      transactions.map((t: Transaction) => t.transactionId).join(","),
    ]
  );

  useEffect(() => {
    if (transactionIds.length === 0) return;

    const subscriptionKeys: string[] = [];

    transactionIds.forEach((transactionId: number) => {
      const key = webSocketService.subscribeToTransactionStatus(
        transactionId,
        (message: TransactionStatusMessage) => {
          setResponse((prev: ApiResponse<Transaction[]> | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: prev.data.map((t: Transaction) =>
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

  // Handlers
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
      fetchTransactions();
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

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
      fetchTransactions();
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
      fetchTransactions();
    } catch (error) {
      toast.error("Lỗi: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSubmitRating = async (rating: 1 | -1, comment: string) => {
    if (!ratingDialog.transactionId || !ratingDialog.otherPartyId) return;

    try {
      setProcessingId(ratingDialog.transactionId);
      await ratingAPI.createRating({
        transactionId: ratingDialog.transactionId,
        rateeId: ratingDialog.otherPartyId,
        diem: rating,
        nhanXet: comment,
      });
      toast.success("Đã gửi đánh giá");
      setRatingDialog({ open: false, transactionId: null, otherPartyId: null });
      fetchTransactions();
    } finally {
      setProcessingId(null);
    }
  };

  const title = role === "buyer" ? "Giao dịch mua" : "Giao dịch bán";
  const Icon = role === "buyer" ? ShoppingBag : Store;

  if (error) {
    return (
      <PageWrapper title={title}>
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
    <PageWrapper title={title}>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex items-center mb-4 sm:mb-6 gap-3">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">{title} của tôi</h1>
        </div>

        {loading ? (
          <PageLoader message="Đang tải giao dịch..." />
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center text-sm sm:text-base">
              Chưa có giao dịch
            </CardContent>
          </Card>
        ) : (
          <>
            <TooltipProvider>
              <div className="space-y-3">
                {transactions.map((transaction: Transaction) => (
                  <TransactionCard
                    key={transaction.transactionId}
                    transaction={transaction}
                    role={role}
                    processingId={processingId}
                    onPayNow={role === "buyer" ? handlePayNow : undefined}
                    onAddAddress={
                      role === "buyer"
                        ? (id) =>
                            setAddressDialog({
                              open: true,
                              transactionId: id,
                              address: "",
                            })
                        : undefined
                    }
                    onAddTracking={
                      role === "seller"
                        ? (id) =>
                            setTrackingDialog({
                              open: true,
                              transactionId: id,
                              tracking: "",
                            })
                        : undefined
                    }
                    onConfirmDelivery={
                      role === "buyer"
                        ? (id) =>
                            setConfirmDialog({ open: true, transactionId: id })
                        : undefined
                    }
                    onRate={(id, otherPartyId) =>
                      setRatingDialog({
                        open: true,
                        transactionId: id,
                        otherPartyId,
                      })
                    }
                    onViewDetail={(id) =>
                      navigate(`/transactions/${id}/detail`)
                    }
                  />
                ))}
              </div>
            </TooltipProvider>

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

            {/* Address Dialog - Buyer only */}
            {role === "buyer" && (
              <Dialog
                open={addressDialog.open}
                onOpenChange={(open) =>
                  setAddressDialog({ open, transactionId: null, address: "" })
                }
              >
                <DialogContent className="max-w-[90vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">
                      Nhập địa chỉ giao hàng
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Vui lòng cung cấp địa chỉ nhận hàng chi tiết
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">
                        Địa chỉ giao hàng
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Số nhà, tên đường, phường, quận, thành phố..."
                        value={addressDialog.address}
                        onChange={(e) =>
                          setAddressDialog((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 flex-col sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setAddressDialog({
                          open: false,
                          transactionId: null,
                          address: "",
                        })
                      }
                      className="w-full sm:w-auto text-sm"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleAddAddress}
                      disabled={processingId === addressDialog.transactionId}
                      className="w-full sm:w-auto text-sm"
                    >
                      {processingId === addressDialog.transactionId
                        ? "Đang xử lý..."
                        : "Xác nhận"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Tracking Dialog - Seller only */}
            {role === "seller" && (
              <Dialog
                open={trackingDialog.open}
                onOpenChange={(open) =>
                  setTrackingDialog({ open, transactionId: null, tracking: "" })
                }
              >
                <DialogContent className="max-w-[90vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">
                      Cập nhật mã vận đơn
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Vui lòng nhập mã vận đơn để cập nhật trạng thái giao hàng
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tracking" className="text-sm">
                        Mã vận đơn
                      </Label>
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
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 flex-col sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setTrackingDialog({
                          open: false,
                          transactionId: null,
                          tracking: "",
                        })
                      }
                      className="w-full sm:w-auto text-sm"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleAddTracking}
                      disabled={processingId === trackingDialog.transactionId}
                      className="w-full sm:w-auto text-sm"
                    >
                      {processingId === trackingDialog.transactionId
                        ? "Đang xử lý..."
                        : "Xác nhận"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Confirm Delivery Dialog - Buyer only */}
            {role === "buyer" && (
              <AlertDialog
                open={confirmDialog.open}
                onOpenChange={(open) =>
                  setConfirmDialog({ open, transactionId: null })
                }
              >
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base sm:text-lg">
                      Xác nhận đã nhận hàng?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm">
                      Bạn có chắc chắn đã nhận hàng? Hành động này không thể
                      hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
                    <AlertDialogCancel className="w-full sm:w-auto text-sm">
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelivery}
                      disabled={processingId === confirmDialog.transactionId}
                      className="w-full sm:w-auto text-sm"
                    >
                      {processingId === confirmDialog.transactionId
                        ? "Đang xử lý..."
                        : "Xác nhận"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Rating Dialog - Both roles */}
            <RatingDialog
              open={ratingDialog.open}
              onOpenChange={(open) =>
                setRatingDialog({
                  open,
                  transactionId: null,
                  otherPartyId: null,
                })
              }
              onSubmit={handleSubmitRating}
              otherPartyRole={role === "buyer" ? "seller" : "buyer"}
              processing={processingId === ratingDialog.transactionId}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
