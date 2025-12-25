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
      toast.error("Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ giao hÃ ng");
      return;
    }
    onSubmitAddress(address);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="address">Äá»‹a chá»‰ giao hÃ ng</Label>
      <Textarea
        id="address"
        placeholder="Nháº­p Ä‘á»‹a chá»‰ Ä‘áº§y Ä‘á»§..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        XÃ¡c nháº­n Ä‘á»‹a chá»‰
      </Button>
    </div>
  );
}
