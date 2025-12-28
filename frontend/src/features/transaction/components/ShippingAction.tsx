import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ShippingActionProps {
  initialAddress?: string;
  onSubmitAddress: (address: string) => void;
  isCompact?: boolean;
}

interface ShippingFormData {
  address: string;
}

export function ShippingAction({
  initialAddress = "",
  onSubmitAddress,
  isCompact = false,
}: ShippingActionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    defaultValues: { address: initialAddress },
  });

  const onSubmit = (data: ShippingFormData) => {
    if (!data.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    onSubmitAddress(data.address);
  };

  if (isCompact) {
    return (
      <Button
        onClick={handleSubmit(onSubmit)}
        className="w-full text-sm"
        variant="default"
      >
        Cập nhật địa chỉ
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="address">Địa chỉ giao hàng</Label>
      <Textarea
        id="address"
        placeholder="Nhập địa chỉ đầy đủ..."
        {...register("address", {
          required: "Vui lòng nhập địa chỉ giao hàng",
        })}
      />
      {errors.address && (
        <p className="text-sm text-destructive">{errors.address.message}</p>
      )}
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        Xác nhận địa chỉ
      </Button>
    </div>
  );
}
