import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeliveryActionProps {
  onConfirmDelivery: () => void;
}

export function DeliveryAction({ onConfirmDelivery }: DeliveryActionProps) {
  return (
    <div className="space-y-3">
      <Alert>
        <AlertDescription>
          Chá»‰ xÃ¡c nháº­n khi Ä‘Ã£ nháº­n hÃ ng vÃ  kiá»ƒm tra ká»¹ sáº£n pháº©m
        </AlertDescription>
      </Alert>
      <Button onClick={onConfirmDelivery} className="w-full">
        XÃ¡c nháº­n Ä‘Ã£ nháº­n hÃ ng
      </Button>
    </div>
  );
}
