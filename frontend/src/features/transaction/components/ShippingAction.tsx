import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ShippingActionProps {
  initialAddress?: string;
  onSubmitAddress: (address: string) => void;
}

export function ShippingAction({
  initialAddress = "",
  onSubmitAddress,
}: ShippingActionProps) {
  const [address, setAddress] = useState(initialAddress);

  const handleSubmit = () => {
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    onSubmitAddress(address);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="address">Địa chỉ giao hàng</Label>
      <Textarea
        id="address"
        placeholder="Nhập địa chỉ đầy đủ..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        Xác nhận địa chỉ
      </Button>
    </div>
  );
}
