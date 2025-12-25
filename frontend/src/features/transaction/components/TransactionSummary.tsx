import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Transaction } from "@/types/transaction";
import { Package, User, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TransactionSummaryProps {
  transaction: Transaction;
  currentUserRole: "buyer" | "seller";
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function TransactionSummary({
  transaction,
  currentUserRole,
}: TransactionSummaryProps) {
  const otherParty =
    currentUserRole === "buyer"
      ? { name: transaction.sellerName, label: "Người bán" }
      : { name: transaction.buyerName, label: "Người mua" };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Info */}
        <div className="flex gap-4">
          <img
            src={transaction.productImage}
            alt={transaction.productName}
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">
              {transaction.productName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Mã giao dịch: #{transaction.transactionId}
            </p>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Giá cuối cùng</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(transaction.gia || transaction.giaCuoiCung || 0)}
          </span>
        </div>

        <Separator />

        {/* Other Party Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{otherParty.label}:</span>
            <span className="font-semibold">{otherParty.name}</span>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="font-medium">
              {transaction.createdAt
                ? format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })
                : "N/A"}
            </span>
          </div>

          {/* Shipping Address */}
          {transaction.diaChiGiaoHang && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-gray-600">Địa chỉ giao hàng:</span>
                <p className="font-medium mt-1">{transaction.diaChiGiaoHang}</p>
              </div>
            </div>
          )}

          {/* Tracking Number */}
          {transaction.maVanDon && (
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Mã vận đơn:</span>
              <Badge variant="outline" className="font-mono">
                {transaction.maVanDon}
              </Badge>
            </div>
          )}
        </div>

        {/* Payment Info */}
        {transaction.thoiGianThanhToan && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Thông tin thanh toán</p>
              <div className="text-sm space-y-1">
                {transaction.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">
                      {transaction.paymentMethod}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {format(
                      new Date(transaction.thoiGianThanhToan),
                      "dd/MM/yyyy HH:mm",
                      { locale: vi }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
