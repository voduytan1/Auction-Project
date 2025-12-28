import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeliveryActionProps {
  onConfirmDelivery: () => void;
  isCompact?: boolean;
}

export function DeliveryAction({
  onConfirmDelivery,
  isCompact = false,
}: DeliveryActionProps) {
  if (isCompact) {
    return (
      <Button
        onClick={onConfirmDelivery}
        className="w-full text-sm"
        variant="default"
      >
        Đã nhận hàng
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Alert>
        <AlertDescription className="text-xs sm:text-sm">
          Chỉ xác nhận khi đã nhận hàng và kiểm tra kỹ sản phẩm
        </AlertDescription>
      </Alert>
      <Button onClick={onConfirmDelivery} className="w-full">
        Xác nhận đã nhận hàng
      </Button>
    </div>
  );
}
