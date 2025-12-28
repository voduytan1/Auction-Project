import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TrackingActionProps {
  initialTracking?: string;
  onSubmitTracking: (trackingNumber: string) => void;
  isCompact?: boolean;
}

interface TrackingFormData {
  trackingNumber: string;
}

export function TrackingAction({
  initialTracking = "",
  onSubmitTracking,
  isCompact = false,
}: TrackingActionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormData>({
    defaultValues: { trackingNumber: initialTracking },
  });

  const onSubmit = (data: TrackingFormData) => {
    if (!data.trackingNumber.trim()) {
      toast.error("Vui lòng nhập mã vận đơn");
      return;
    }
    onSubmitTracking(data.trackingNumber);
  };

  if (isCompact) {
    return (
      <Button
        onClick={handleSubmit(onSubmit)}
        className="w-full text-sm"
        variant="default"
      >
        Cập nhật vận đơn
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="tracking">Mã vận đơn</Label>
      <Input
        id="tracking"
        placeholder="Nhập mã vận đơn..."
        {...register("trackingNumber", {
          required: "Vui lòng nhập mã vận đơn",
        })}
      />
      {errors.trackingNumber && (
        <p className="text-sm text-destructive">
          {errors.trackingNumber.message}
        </p>
      )}
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        Xác nhận đã gửi hàng
      </Button>
    </div>
  );
}
