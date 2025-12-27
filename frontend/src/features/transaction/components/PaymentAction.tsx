import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams } from "react-router";
import { paymentAPI } from "@/services/payment.api";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

interface PaymentActionProps {
  onPaymentComplete: () => void;
}

export function PaymentAction({ onPaymentComplete }: PaymentActionProps) {
  const { orderId } = useParams<{ orderId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);

  // Avoid unused warning (will be used after payment callback)
  void onPaymentComplete;

  const handlePayment = async () => {
    if (!orderId) return;

    try {
      setIsProcessing(true);
      toast.loading("Đang tạo phiên thanh toán...");

      // Gọi API tạo Stripe Checkout Session
      const response = await paymentAPI.createStripeCheckoutSession(
        Number(orderId)
      );
      const url = response.data?.url;

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
    <div className="space-y-3">
      <Alert>
        <AlertDescription>
          Vui lòng thanh toán trong vòng 24h để hoàn tất đơn hàng
        </AlertDescription>
      </Alert>
      <Button
        onClick={handlePayment}
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
            Đang xử lý...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán ngay với Stripe
          </>
        )}
      </Button>
    </div>
  );
}
