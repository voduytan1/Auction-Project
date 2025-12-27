import { useState, useEffect, useCallback } from "react";
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
import { PageLoader } from "@/components/PageLoader";
import { transactionAPI } from "@/services/transaction.api";
import { paymentAPI } from "@/services/payment.api";
import type { Transaction, TransactionStatus } from "@/types/transaction";
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
                                        navigate(
                                          `/transactions/${transaction.transactionId}/detail`
                                        )
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                    >
                                      <MapPin className="h-4 w-4 mr-1.5" />
                                      Nhập địa chỉ
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
                                        navigate(
                                          `/transactions/${transaction.transactionId}/detail`
                                        )
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1.5" />
                                      Xác nhận
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
                                        navigate(
                                          `/transactions/${transaction.transactionId}/detail`
                                        )
                                      }
                                      size="sm"
                                      className="h-9 px-4 shadow-sm"
                                    >
                                      <Star className="h-4 w-4 mr-1.5" />
                                      Đánh giá
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
          </>
        )}
      </div>
    </PageWrapper>
  );
}
