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
      toast.error("Vui lÃ²ng nháº­p mÃ£ váº­n Ä‘Æ¡n");
      return;
    }
    onSubmitTracking(trackingNumber);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="tracking">MÃ£ váº­n Ä‘Æ¡n</Label>
      <Input
        id="tracking"
        placeholder="Nháº­p mÃ£ váº­n Ä‘Æ¡n..."
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full">
        XÃ¡c nháº­n Ä‘Ã£ gá»­i hÃ ng
      </Button>
    </div>
  );
}
