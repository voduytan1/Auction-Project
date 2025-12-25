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
      toast.loading("Äang táº¡o phiÃªn thanh toÃ¡n...");

      // Gá»i API táº¡o Stripe Checkout Session
      const { url } = await paymentAPI.createStripeCheckoutSession(
        Number(orderId)
      );

      toast.dismiss();
      toast.success("Chuyá»ƒn hÆ°á»›ng Ä‘áº¿n trang thanh toÃ¡n...");

      // Redirect Ä‘áº¿n Stripe Checkout
      window.location.href = url;
    } catch (error) {
      toast.dismiss();
      toast.error("Lá»—i khi táº¡o phiÃªn thanh toÃ¡n: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <Alert>
        <AlertDescription>
          Vui lÃ²ng thanh toÃ¡n trong vÃ²ng 24h Ä‘á»ƒ hoÃ n táº¥t Ä‘Æ¡n hÃ ng
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
            Äang xá»­ lÃ½...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toÃ¡n ngay vá»›i Stripe
          </>
        )}
      </Button>
    </div>
  );
}
