import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Trang xÃ¡c nháº­n thanh toÃ¡n thÃ nh cÃ´ng tá»« Stripe
 * ÄÆ°á»£c redirect tá»« Stripe sau khi thanh toÃ¡n thÃ nh cÃ´ng
 */
export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Thanh toÃ¡n thÃ nh cÃ´ng! ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½.");
    }
  }, [sessionId]);

  const handleViewOrders = () => {
    navigate("/bidder/purchases");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <PageWrapper title="Thanh toÃ¡n thÃ nh cÃ´ng">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Thanh toÃ¡n thÃ nh cÃ´ng!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6 animate-pulse" />

            <h2 className="text-xl font-semibold mb-3 text-green-700">
              Cáº£m Æ¡n báº¡n Ä‘Ã£ thanh toÃ¡n!
            </h2>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c thanh toÃ¡n thÃ nh cÃ´ng. NgÆ°á»i bÃ¡n sáº½ sá»›m
              gá»­i hÃ ng cho báº¡n.
            </p>

            {sessionId && (
              <div className="bg-muted p-4 rounded-lg mb-6 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-1">
                  MÃ£ phiÃªn thanh toÃ¡n:
                </p>
                <p className="font-mono text-sm break-all">{sessionId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleViewOrders} size="lg">
                Xem giao dá»‹ch cá»§a tÃ´i
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={handleGoHome} variant="outline" size="lg">
                Vá» trang chá»§
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
