import { useState } from "react";
import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { transactionAPI } from "@/services/transaction.api";
import type { Transaction, TransactionStatus } from "@/types/transaction";
import { formatCurrency } from "@/lib/format";
import {
  Store,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Map trạng thái sang màu sắc
const getStatusConfig = (status: TransactionStatus) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return { label: "Chờ thanh toán", color: "bg-yellow-500", icon: Clock };
    case "PAYMENT_COMPLETED":
      return {
        label: "Đã thanh toán",
        color: "bg-green-500",
        icon: CheckCircle,
      };
    case "AWAITING_SHIPMENT":
      return { label: "Chờ gửi hàng", color: "bg-blue-500", icon: Package };
    case "SHIPPED":
      return { label: "Đã gửi hàng", color: "bg-indigo-500", icon: Truck };
    case "DELIVERED":
      return {
        label: "Đã nhận hàng",
        color: "bg-purple-500",
        icon: CheckCircle,
      };
    case "COMPLETED":
      return { label: "Hoàn tất", color: "bg-emerald-500", icon: CheckCircle };
    case "CANCELLED":
      return { label: "Đã hủy", color: "bg-red-500", icon: XCircle };
    default:
      return { label: status, color: "bg-gray-500", icon: Package };
  }
};

export default function SellerTransactionsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, loading, error } = useFetch(() =>
    transactionAPI.getSellerTransactions({ page, size })
  );

  const transactions = data?.data || [];
  const totalPages = data ? Math.ceil(data.total / size) : 0;

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Store className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Bạn chưa có giao dịch bán nào</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((transaction: Transaction) => {
                const statusConfig = getStatusConfig(transaction.trangThai);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={transaction.transactionId}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/transactions/${transaction.transactionId}/detail`
                      )
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {transaction.tenSanPham ||
                              `Sản phẩm #${transaction.productId}`}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Người mua:{" "}
                            {transaction.tenNguoiMua || transaction.buyerId}
                          </p>
                        </div>
                        <Badge
                          className={`${statusConfig.color} text-white flex items-center gap-1`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Giá bán
                          </p>
                          <p className="font-semibold text-lg text-green-600">
                            {formatCurrency(transaction.gia)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ngày tạo
                          </p>
                          <p className="font-medium">
                            {transaction.createdAt &&
                              format(
                                new Date(transaction.createdAt),
                                "dd/MM/yyyy",
                                {
                                  locale: vi,
                                }
                              )}
                          </p>
                        </div>
                        {transaction.thoiGianThanhToan && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đã thanh toán
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(transaction.thoiGianThanhToan),
                                "dd/MM/yyyy",
                                { locale: vi }
                              )}
                            </p>
                          </div>
                        )}
                        {transaction.maVanDon && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Mã vận đơn
                            </p>
                            <p className="font-medium font-mono">
                              {transaction.maVanDon}
                            </p>
                          </div>
                        )}
                      </div>

                      {transaction.diaChiGiaoHang && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">
                            Địa chỉ giao hàng
                          </p>
                          <p className="font-medium">
                            {transaction.diaChiGiaoHang}
                          </p>
                        </div>
                      )}

                      {(transaction.trangThai === "PAYMENT_COMPLETED" ||
                        transaction.trangThai === "AWAITING_SHIPMENT") && (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/transactions/${transaction.transactionId}/detail`
                              );
                            }}
                            className="w-full sm:w-auto"
                          >
                            Cập nhật vận chuyển
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  Trang trước
                </Button>
                <div className="flex items-center px-4">
                  Trang {page + 1} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page + 1 >= totalPages}
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
