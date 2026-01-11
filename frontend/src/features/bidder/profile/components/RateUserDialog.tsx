import { useState } from "react";
import { useForm } from "react-hook-form";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface RateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetUserName: string;
  targetUserId: string;
  productName: string;
  raterRole: "BIDDER" | "SELLER"; // Who is rating
}

interface RatingFormData {
  ratingType: "POSITIVE" | "NEGATIVE";
  comment: string;
}

export function RateUserDialog({
  open,
  onOpenChange,
  targetUserName,
  targetUserId,
  productName,
  raterRole,
}: RateUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RatingFormData>({
    defaultValues: {
      ratingType: "POSITIVE",
      comment: "",
    },
  });

  const ratingType = watch("ratingType");

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: RatingFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to submit rating
      // await ratingApi.rateUser(targetUserId, data);

      console.log("Submitting rating:", {
        targetUserId,
        ratingType: data.ratingType,
        comment: data.comment,
        raterRole,
      });

      // Update target user's rating score
      // POSITIVE: +1 point, NEGATIVE: -1 point
      const scoreChange = data.ratingType === "POSITIVE" ? 1 : -1;
      console.log(`User ${targetUserId} rating changed by: ${scoreChange}`);

      toast.success(
        `Đã gửi đánh giá ${
          data.ratingType === "POSITIVE" ? "tích cực (+1)" : "tiêu cực (-1)"
        } cho ${targetUserName}`
      );
      handleClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetRole = raterRole === "BIDDER" ? "người bán" : "người mua";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Đánh giá {targetRole}</DialogTitle>
          <DialogDescription>
            Đánh giá <strong>{targetUserName}</strong> cho sản phẩm:{" "}
            <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Rating Type Selection */}
          <div className="space-y-3">
            <Label>
              Loại đánh giá <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              defaultValue="POSITIVE"
              onValueChange={(value) => {
                // Update form value
                const ratingValue = value as "POSITIVE" | "NEGATIVE";
                register("ratingType").onChange({
                  target: { value: ratingValue },
                });
              }}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="POSITIVE" id="positive" />
                <Label
                  htmlFor="positive"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Tích cực (+1 điểm)</p>
                    <p className="text-sm text-muted-foreground">
                      Giao dịch tốt, {targetRole} uy tín
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="NEGATIVE" id="negative" />
                <Label
                  htmlFor="negative"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Tiêu cực (-1 điểm)</p>
                    <p className="text-sm text-muted-foreground">
                      Giao dịch có vấn đề, không uy tín
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            <input type="hidden" {...register("ratingType")} />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              Nhận xét <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="comment"
                className="pl-10 min-h-30"
                {...register("comment", {
                  required: "Vui lòng nhập nhận xét",
                  minLength: {
                    value: 10,
                    message: "Nhận xét phải có ít nhất 10 ký tự",
                  },
                  maxLength: {
                    value: 500,
                    message: "Nhận xét không được quá 500 ký tự",
                  },
                })}
                placeholder={`Chia sẻ trải nghiệm của bạn về ${targetRole}...`}
              />
            </div>
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Nhận xét chi tiết giúp người khác đưa ra quyết định tốt hơn
            </p>
          </div>

          {/* Rating Impact Alert */}
          <Alert
            variant={ratingType === "POSITIVE" ? "default" : "destructive"}
          >
            <AlertDescription className="text-sm">
              {ratingType === "POSITIVE" ? (
                <>
                  <strong>Đánh giá tích cực</strong> sẽ thêm 1 điểm cho{" "}
                  {targetUserName}, giúp tăng uy tín và tỷ lệ đánh giá tốt.
                </>
              ) : (
                <>
                  <strong>Đánh giá tiêu cực</strong> sẽ trừ 1 điểm của{" "}
                  {targetUserName}, ảnh hưởng đến uy tín và khả năng giao dịch.
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
