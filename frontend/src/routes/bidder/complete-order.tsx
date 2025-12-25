import { useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { CheckCircle2, Package, Trophy } from "lucide-react";
import type { ProductResponse } from "@/services/product.api";

interface LocationState {
  isSeller?: boolean;
  isWinner?: boolean;
  product?: ProductResponse;
}

export default function CompleteOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const isSeller = state?.isSeller || false;
  const isWinner = state?.isWinner || false;
  const product = state?.product;

  return (
    <div className="container px-4 py-12 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSeller ? (
              <>
                <Package className="h-6 w-6 text-green-600" />
                <span className="text-green-600">Bán thành công!</span>
              </>
            ) : (
              <>
                <Trophy className="h-6 w-6 text-amber-600" />
                <span className="text-amber-600">
                  Chúc mừng! Bạn đã thắng sản phẩm này
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  {isSeller
                    ? "Sản phẩm của bạn đã được bán"
                    : "Bạn đã thắng đấu giá"}
                </h3>
                <p className="text-sm text-green-700">
                  {isSeller
                    ? "Vui lòng chuẩn bị sản phẩm và chờ người mua liên hệ để hoàn tất giao dịch."
                    : "Vui lòng liên hệ với người bán để hoàn tất giao dịch và nhận sản phẩm."}
                </p>
              </div>
            </div>
          </div>

          {product && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">
                Thông tin sản phẩm
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tên sản phẩm:</span>
                  <span className="font-semibold">{product.tenSanPham}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {isSeller ? "Giá bán:" : "Giá mua:"}
                  </span>
                  <span className="font-semibold text-accent">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.giaHienTai)}
                  </span>
                </div>
                {isSeller && product.tenBidder && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Người mua:</span>
                    <span className="font-semibold">{product.tenBidder}</span>
                  </div>
                )}
                {isWinner && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Người bán:</span>
                    <span className="font-semibold">{product.tenSeller}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={() => navigate(`/profile`)} className="flex-1">
              {isSeller ? "Xem sản phẩm của tôi" : "Xem đơn hàng"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/`)}
              className="flex-1"
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
