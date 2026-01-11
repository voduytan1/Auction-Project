import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";
import { imageAPI } from "@/services/image.api";

interface TrackingActionProps {
  initialTracking?: string;
  onSubmitTracking: (trackingNumber: string, trackingImage: string) => void;
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
  const [trackingImage, setTrackingImage] = useState<string>("");
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
    if (!trackingImage) {
      toast.error("Vui lòng tải lên ảnh vận đơn");
      return;
    }
    onSubmitTracking(data.trackingNumber, trackingImage);
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
      <div>
        <Label htmlFor="tracking" className="text-sm">
          Mã vận đơn <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tracking"
          placeholder="Nhập mã vận đơn..."
          {...register("trackingNumber", {
            required: "Vui lòng nhập mã vận đơn",
          })}
          className="text-sm"
        />
        {errors.trackingNumber && (
          <p className="text-sm text-destructive">
            {errors.trackingNumber.message}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm">
          Ảnh vận đơn <span className="text-destructive">*</span>
        </Label>
        <ImageUploader
          mode="single"
          currentImage={trackingImage}
          onUploadComplete={async (file) => {
            try {
              const uploadedFile = Array.isArray(file) ? file[0] : file;
              const uploadResult = await imageAPI.uploadSingle(uploadedFile);
              setTrackingImage(uploadResult.url);
              toast.success("Upload ảnh thành công!");
            } catch (error) {
              console.error("Error uploading image:", error);
              toast.error("Upload ảnh thất bại!");
            }
          }}
        />
      </div>

      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        Xác nhận đã gửi hàng
      </Button>
    </div>
  );
}
