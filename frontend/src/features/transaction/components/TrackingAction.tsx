import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TrackingActionProps {
  initialTracking?: string;
  onSubmitTracking: (trackingNumber: string) => void;
}

export function TrackingAction({
  initialTracking = "",
  onSubmitTracking,
}: TrackingActionProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);

  const handleSubmit = () => {
    if (!trackingNumber.trim()) {
      toast.error("Vui lòng nhập mã vận đơn");
      return;
    }
    onSubmitTracking(trackingNumber);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="tracking">Mã vận đơn</Label>
      <Input
        id="tracking"
        placeholder="Nhập mã vận đơn..."
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        Xác nhận đã gửi hàng
      </Button>
    </div>
  );
}
