import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { auctionAPI } from "@/services/auction.api";
import type { ApiErrorResponse } from "@/types/types";
import type { AxiosError } from "axios";

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

export default function CreateOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const productId = state?.productId;
  const buyNowPrice = state?.buyNowPrice;
  const productName = state?.productName;

  const [step, setStep] = useState(1);
  const [completeLoading, setCompleteLoading] = useState(false);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Thanh toán & Hoàn tất đơn hàng
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quy trình ({step}/4)</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div>
                  <h3 className="font-semibold">
                    1. Chọn phương thức thanh toán
                  </h3>
                  <p className="text-sm text-slate-600">
                    Chọn MoMo / ZaloPay / VNPay-QR / Stripe / PayPal / ...
                    (demo)
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setStep(2)}>
                      Thanh toán (demo)
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-semibold">2. Nhập địa chỉ giao hàng</h3>
                  <p className="text-sm text-slate-600">
                    Nhập thông tin giao hàng.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setStep(3)}>Lưu địa chỉ</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-semibold">
                    3. Chờ người bán xác nhận gửi hàng
                  </h3>
                  <p className="text-sm text-slate-600">
                    Sau khi người bán xác nhận đã nhận tiền và gửi hoá đơn, bạn
                    sẽ được yêu cầu xác nhận nhận hàng.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setStep(4)}>
                      Đã nhận hàng (demo)
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="font-semibold">4. Đánh giá giao dịch</h3>
                  <p className="text-sm text-slate-600">
                    Cho điểm người bán và nhận xét ngắn.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={async () => {
                        try {
                          setCompleteLoading(true);
                          const resp = await auctionAPI.buyNow(
                            Number(productId)
                          );
                          const orderId = extractOrderId(resp.data);

                          if (orderId !== null && orderId !== undefined) {
                            navigate(`/orders/${orderId}/complete`);
                          } else {
                            navigate(`/profile`);
                          }
                        } catch (error) {
                          console.error("Finalize order failed", error);
                          const axiosError =
                            error as AxiosError<ApiErrorResponse>;
                          alert(
                            axiosError.response?.data?.message ||
                              "Không thể hoàn tất đơn hàng"
                          );
                        } finally {
                          setCompleteLoading(false);
                        }
                      }}
                      disabled={completeLoading}
                    >
                      {completeLoading ? "Đang xử lý..." : "Hoàn tất"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Sản phẩm</div>
                <div className="font-semibold">{productName || "-"}</div>
                <div className="text-sm text-slate-600">Giá mua ngay</div>
                <div className="font-semibold">{buyNowPrice ?? "-"} VND</div>
                <div className="text-sm text-slate-600">Product ID</div>
                <div className="font-mono text-sm">{String(productId)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
