import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams } from "react-router";
import { paymentAPI } from "@/services/payment.api";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

interface PaymentActionProps {
  onPaymentComplete: () => void;
  isCompact?: boolean;
}

export function PaymentAction({
  onPaymentComplete,
  isCompact = false,
}: PaymentActionProps) {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);

  // Avoid unused warning (will be used after payment callback)
  void onPaymentComplete;

  const handlePayment = async () => {
    if (!transactionId) return;

    try {
      setIsProcessing(true);
      toast.loading("Đang tạo phiên thanh toán...");

      // Gọi API tạo Stripe Checkout Session
      const response = await paymentAPI.createStripeCheckoutSession(
        Number(transactionId)
      );
      const url = response.data?.url;

      if (!url) {
        throw new Error("Không nhận được URL thanh toán");
      }

      toast.dismiss();
      toast.success("Chuyển hướng đến trang thanh toán...");

      // Redirect đến Stripe Checkout
      window.location.href = url;
    } catch (error) {
      toast.dismiss();
      toast.error("Lỗi khi tạo phiên thanh toán: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  return (
    <div className={isCompact ? "" : "space-y-3"}>
      {!isCompact && (
        <Alert>
          <AlertDescription className="text-xs sm:text-sm">
            Vui lòng thanh toán trong vòng 24h để hoàn tất đơn hàng
          </AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handlePayment}
        className={isCompact ? "w-full text-sm" : "w-full text-sm sm:text-base"}
        disabled={isProcessing}
        size={isCompact ? "default" : undefined}
      >
        {isProcessing ? (
          <>
            <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
            {isCompact ? (
              "Xử lý..."
            ) : (
              <>
                <span className="hidden sm:inline">Đang xử lý...</span>
                <span className="sm:hidden">Xử lý...</span>
              </>
            )}
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {isCompact ? (
              "Thanh toán"
            ) : (
              <>
                <span className="hidden sm:inline">
                  Thanh toán ngay với Stripe
                </span>
                <span className="sm:hidden">Thanh toán</span>
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
