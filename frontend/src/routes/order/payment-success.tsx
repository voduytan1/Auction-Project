import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/PageLoader";

/**
 * Trang thông báo thanh toán thành công từ Stripe
 * Được redirect từ Stripe khi user thanh toán thành công
 * Hướng dẫn user đến bước tiếp theo: nhập địa chỉ giao hàng
 */
export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (sessionId) {
      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");

      // Countdown để tự động redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/bidder/purchases");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sessionId, navigate]);

  const handleContinueToAddress = () => {
    navigate("/bidder/purchases");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!sessionId) {
    return (
      <PageWrapper title="Thanh toán">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <PageLoader message="Đang xử lý thanh toán..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Thanh toán thành công">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Thanh toán thành công!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <CheckCircle2 className="h-24 w-24 text-primary mx-auto mb-6 animate-pulse" />

            <h2 className="text-xl font-semibold mb-3 text-primary">
              Cảm ơn bạn đã thanh toán!
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Đơn hàng của bạn đã được thanh toán thành công.
            </p>

            {/* Quy trình 4 bước */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-4 text-center">
                📋 Các bước tiếp theo
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm font-bold shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Bước 1: Thanh toán (Hoàn tất)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bạn đã thanh toán thành công
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm text-blue-900">
                      Bước 2: Nhập địa chỉ giao hàng
                    </p>
                    <p className="text-xs text-blue-700">
                      Vui lòng cung cấp địa chỉ để nhận hàng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-600">
                      Bước 3: Người bán gửi hàng
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Người bán sẽ cập nhật mã vận đơn
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white text-sm font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-600">
                      Bước 4: Nhận hàng & đánh giá
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Xác nhận nhận hàng và đánh giá người bán
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleContinueToAddress}
                size="lg"
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Tiếp tục nhập địa chỉ
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={handleGoHome} variant="outline" size="lg">
                Về trang chủ
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Tự động chuyển đến giao dịch sau{" "}
              <span className="font-bold text-blue-600">{countdown}</span> giây
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
