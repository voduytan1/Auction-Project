import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Transaction } from "@/types/transaction";
import { Package, User, MapPin } from "lucide-react";
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
      ? { name: transaction.tenNguoiBan, label: "Người bán" }
      : { name: transaction.tenNguoiMua, label: "Người mua" };

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
            alt={transaction.tenSanPham}
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">
              {transaction.tenSanPham}
            </h3>
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

          {/* Shipping Address */}
          {transaction.diaChiGiaoHang && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-gray-600">
                  Địa chỉ giao hàng:{" "}
                  <p className="font-medium mt-1">
                    {transaction.diaChiGiaoHang}
                  </p>
                </span>
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

        {/* Timeline Info */}
        {(transaction.thoiGianThanhToan ||
          transaction.thoiGianGiaoHang ||
          transaction.thoiGianNhanHang) && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Lịch sử giao dịch</p>
              <div className="text-sm space-y-2">
                {transaction.thoiGianThanhToan && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thanh toán:</span>
                    <span className="font-medium">
                      {format(
                        new Date(transaction.thoiGianThanhToan),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </span>
                  </div>
                )}
                {transaction.thoiGianGiaoHang && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gửi hàng:</span>
                    <span className="font-medium">
                      {format(
                        new Date(transaction.thoiGianGiaoHang),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </span>
                  </div>
                )}
                {transaction.thoiGianNhanHang && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nhận hàng:</span>
                    <span className="font-medium">
                      {format(
                        new Date(transaction.thoiGianNhanHang),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
