import { useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Trang thÃ´ng bÃ¡o há»§y thanh toÃ¡n tá»« Stripe
 * ÄÆ°á»£c redirect tá»« Stripe khi user há»§y thanh toÃ¡n
 */
export default function PaymentCancelPage() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    // Quay vá» trang chá»§ Ä‘á»ƒ chá»n sáº£n pháº©m khÃ¡c
    navigate("/");
  };

  const handleViewPurchases = () => {
    navigate("/bidder/purchases");
  };

  return (
    <PageWrapper title="ÄÃ£ há»§y thanh toÃ¡n">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              ÄÃ£ há»§y thanh toÃ¡n
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <XCircle className="h-24 w-24 text-yellow-500 mx-auto mb-6" />

            <h2 className="text-xl font-semibold mb-3 text-yellow-700">
              Báº¡n Ä‘Ã£ há»§y thanh toÃ¡n
            </h2>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              ÄÆ¡n hÃ ng cá»§a báº¡n chÆ°a Ä‘Æ°á»£c thanh toÃ¡n. Báº¡n cÃ³ thá»ƒ thá»­ láº¡i báº¥t cá»©
              lÃºc nÃ o.
            </p>

            <Alert className="mb-6 max-w-md mx-auto bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800 text-sm">
                <strong>LÆ°u Ã½:</strong> Náº¿u báº¡n Ä‘Ã£ Ä‘áº¥u giÃ¡ thÃ nh cÃ´ng, báº¡n cáº§n
                thanh toÃ¡n Ä‘á»ƒ hoÃ n táº¥t Ä‘Æ¡n hÃ ng. ÄÆ¡n hÃ ng sáº½ tá»± Ä‘á»™ng há»§y náº¿u
                khÃ´ng thanh toÃ¡n trong thá»i gian quy Ä‘á»‹nh.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleViewPurchases} variant="default" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Vá» danh sÃ¡ch giao dá»‹ch
              </Button>
              <Button onClick={handleTryAgain} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                TÃ¬m sáº£n pháº©m khÃ¡c
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
