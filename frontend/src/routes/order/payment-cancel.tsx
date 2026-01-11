import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

/**
 * Trang thông báo hủy thanh toán từ Stripe
 * Được redirect từ Stripe khi user hủy thanh toán
 */
export default function PaymentCancelPage() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    // Quay về trang chủ để chọn sản phẩm khác
    navigate("/");
  };

  const handleViewPurchases = () => {
    navigate("/bidder/transactions");
  };

  return (
    <PageWrapper title="Đã hủy thanh toán">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Đã hủy thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <XCircle className="h-24 w-24 text-destructive mx-auto mb-6" />

            <h2 className="text-xl font-semibold mb-3 text-destructive">
              Bạn đã hủy thanh toán
            </h2>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Đơn hàng của bạn chưa được thanh toán. Bạn có thể thử lại bất cứ
              lúc nào.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleViewPurchases} variant="default" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Về danh sách giao dịch
              </Button>
              <Button onClick={handleTryAgain} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tìm sản phẩm khác
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
