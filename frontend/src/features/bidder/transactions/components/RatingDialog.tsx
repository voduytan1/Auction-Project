import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: 1 | -1, comment: string) => Promise<void>;
  otherPartyRole: "buyer" | "seller";
  processing: boolean;
}

interface RatingFormData {
  comment: string;
}

export function RatingDialog({
  open,
  onOpenChange,
  onSubmit,
  otherPartyRole,
  processing,
}: RatingDialogProps) {
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<RatingFormData>();

  const handleSubmit = async (data: RatingFormData) => {
    if (rating === null) {
      toast.error("Vui lòng chọn đánh giá");
      return;
    }

    if (!data.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }

    await onSubmit(rating, data.comment);
    setRating(null);
    reset();
  };

  const handleCancel = () => {
    setRating(null);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Đánh giá người {otherPartyRole === "buyer" ? "mua" : "bán"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Vui lòng chọn đánh giá và nhập nhận xét của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-4">
          {/* Rating Selection */}
          <div className="space-y-2">
            <Label className="text-sm">Chọn đánh giá</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="button"
                variant={rating === 1 ? "default" : "outline"}
                size="default"
                className="flex-1 text-sm sm:text-base"
                onClick={() => setRating(1)}
              >
                <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Tốt (+1)
              </Button>
              <Button
                type="button"
                variant={rating === -1 ? "destructive" : "outline"}
                size="default"
                className="flex-1 text-sm sm:text-base"
                onClick={() => setRating(-1)}
              >
                <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Xấu (-1)
              </Button>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="rating-comment" className="text-sm">
              Nhận xét
            </Label>
            <Textarea
              id="rating-comment"
              placeholder={`Nhập nhận xét về người ${
                otherPartyRole === "buyer" ? "mua" : "bán"
              }...`}
              {...register("comment", {
                required: "Vui lòng nhập nhận xét",
              })}
              rows={4}
              className="text-sm"
            />
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={processing}
            className="text-sm"
          >
            Hủy
          </Button>
          <Button
            onClick={handleFormSubmit(handleSubmit)}
            disabled={processing}
            className="text-sm"
          >
            {processing ? "Đang xử lý..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
