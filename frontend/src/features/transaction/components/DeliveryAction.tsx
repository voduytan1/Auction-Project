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
          Chỉ xác nhận khi đã nhận hàng và kiểm tra kỹ sản phẩm
        </AlertDescription>
      </Alert>
      <Button onClick={onConfirmDelivery} className="w-full">
        Xác nhận đã nhận hàng
      </Button>
    </div>
  );
}
