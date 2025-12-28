import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  Eye,
  CreditCard,
  MapPin,
  Star,
  ShoppingBag,
  Store,
} from "lucide-react";
import type { Transaction, TransactionStatus } from "@/types/transaction";

interface TransactionCardProps {
  transaction: Transaction;
  role: "buyer" | "seller";
  processingId: number | null;
  onPayNow?: (id: number) => void;
  onAddAddress?: (id: number) => void;
  onAddTracking?: (id: number) => void;
  onConfirmDelivery?: (id: number) => void;
  onRate?: (id: number, otherPartyId: string) => void;
  onViewDetail: (id: number) => void;
}

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function TransactionCard({
  transaction,
  role,
  processingId,
  onPayNow,
  onAddAddress,
  onAddTracking,
  onConfirmDelivery,
  onRate,
  onViewDetail,
}: TransactionCardProps) {
  const statusConfig = getStatusConfig(transaction.trangThai);
  const isProcessing = processingId === transaction.transactionId;
  const otherPartyName =
    role === "buyer" ? transaction.tenNguoiBan : transaction.tenNguoiMua;
  const otherPartyId =
    role === "buyer" ? transaction.sellerId : transaction.buyerId;

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 sm:p-5">
        {/* LAYOUT CHÍNH: 
            - Mobile: Flex Col (Dọc) 
            - Tablet/Desktop (md): Flex Row (Ngang) 
        */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* KHỐI TRÁI: Ảnh + Info (Chiếm phần lớn không gian trên Desktop) */}
          <div className="flex gap-4 items-start flex-1">
            {/* Ảnh sản phẩm */}
            <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
              {transaction.anhDaiDienSanPham ? (
                <img
                  src={transaction.anhDaiDienSanPham}
                  alt={transaction.tenSanPham || "Product"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  {role === "buyer" ? (
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Store className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              )}
            </div>

            {/* Thông tin Text */}
            <div className="flex-1 min-w-0 flex flex-col justify-center min-h-20 md:min-h-24">
              <div className="space-y-1.5">
                {/* Status Badge */}
                <div className="flex items-center">
                  <Badge
                    className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-md shadow-none ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Tên sản phẩm */}
                <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight">
                  {transaction.tenSanPham ||
                    `Đơn hàng #${transaction.productId}`}
                </h3>

                {/* Tên đối tác */}
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {role === "buyer" ? "Người bán" : "Người mua"}:{" "}
                  <span className="font-medium text-foreground">
                    {otherPartyName}
                  </span>
                </p>

                {/* Mã vận đơn (nếu có) */}
                {transaction.maVanDon && (
                  <div>
                    {/* Mã vận đơn */}
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px] px-1.5 h-5 w-fit"
                    >
                      Mã vận đơn: {transaction.maVanDon}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KHỐI PHẢI: Giá + Nút bấm */}
          {/* Mobile: Có border-top nét đứt, padding top. Desktop: Bỏ border, bỏ padding top, canh phải */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-3 md:gap-6 border-t border-dashed border-gray-200 pt-3 md:border-0 md:pt-0 w-full md:w-auto">
            {/* Giá tiền */}
            <div className="flex justify-between items-center w-full md:w-auto sm:block text-right">
              <span className="text-sm text-gray-500 sm:hidden">
                Thành tiền:
              </span>
              <p className="font-bold text-lg text-primary whitespace-nowrap">
                {formatCurrency(
                  transaction.gia || transaction.giaCuoiCung || 0
                )}
              </p>
            </div>

            {/* Action Buttons */}
            {/* Mobile: Giãn full width. Desktop: Width tự động */}
            <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
              {/* --- CÁC NÚT CHỨC NĂNG (Primary) --- */}
              {role === "buyer" && (
                <>
                  {transaction.trangThai === "PENDING_PAYMENT" && onPayNow && (
                    <Button
                      size="sm"
                      onClick={() => onPayNow(transaction.transactionId)}
                      disabled={isProcessing}
                      className="flex-1 md:flex-none"
                    >
                      <CreditCard className="h-4 w-4 mr-1.5" />
                      <span>Thanh toán</span>
                    </Button>
                  )}

                  {transaction.trangThai === "PAYMENT_COMPLETED" &&
                    onAddAddress && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddAddress(transaction.transactionId)}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none"
                      >
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>Địa chỉ</span>
                      </Button>
                    )}

                  {transaction.trangThai === "SHIPPED" && onConfirmDelivery && (
                    <Button
                      size="sm"
                      onClick={() =>
                        onConfirmDelivery(transaction.transactionId)
                      }
                      disabled={isProcessing}
                      className="flex-1 md:flex-none"
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      <span>Đã nhận</span>
                    </Button>
                  )}

                  {transaction.trangThai === "COMPLETED" && onRate && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onRate(transaction.transactionId, otherPartyId)
                      }
                      disabled={isProcessing}
                      className="flex-1 md:flex-none"
                    >
                      <Star className="h-4 w-4 mr-1.5" />
                      <span>Đánh giá</span>
                    </Button>
                  )}
                </>
              )}

              {role === "seller" && (
                <>
                  {transaction.trangThai === "AWAITING_SHIPMENT" &&
                    onAddTracking && (
                      <Button
                        size="sm"
                        onClick={() => onAddTracking(transaction.transactionId)}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none"
                      >
                        <Package className="h-4 w-4 mr-1.5" />
                        <span>Gửi hàng</span>
                      </Button>
                    )}

                  {transaction.trangThai === "COMPLETED" && onRate && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onRate(transaction.transactionId, otherPartyId)
                      }
                      disabled={isProcessing}
                      className="flex-1 md:flex-none"
                    >
                      <Star className="h-4 w-4 mr-1.5" />
                      <span>Đánh giá</span>
                    </Button>
                  )}
                </>
              )}

              {/* --- NÚT CHI TIẾT (Luôn hiện) --- */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetail(transaction.transactionId)}
                className="flex-1 md:flex-none bg-primary/5 hover:bg-primary/10 border border-primary/20 "
              >
                <Eye className="h-4 w-4 mr-1.5" />
                <span>Chi tiết</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
