import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
  const transactionId = searchParams.get("transaction_id");
  const transactionLink = transactionId
    ? `/transactions/${transactionId}/detail`
    : null;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (sessionId) {
      toast.success("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");

      // Countdown để tự động redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect đến transaction detail để nhập địa chỉ
            if (transactionLink) {
              navigate(transactionLink);
            } else {
              navigate("/bidder/purchases");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sessionId, navigate, transactionLink]);

  const handleContinueToAddress = () => {
    // Đến trang detail giao dịch để nhập địa chỉ giao hàng
    if (transactionId) {
      navigate(`/transactions/${transactionId}/detail`);
    } else {
      toast.info("Không tìm thấy mã giao dịch, quay lại danh sách mua");
      navigate("/bidder/purchases");
    }
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

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {transactionLink ? (
                <Button asChild size="lg" className="gap-2">
                  <Link to={transactionLink}>
                    <MapPin className="h-4 w-4" />
                    Tiếp tục nhập địa chỉ
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleContinueToAddress}
                  size="lg"
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Tiếp tục nhập địa chỉ
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
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
