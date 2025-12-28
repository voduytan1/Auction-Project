import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface RatingActionProps {
  otherPartyRole: "buyer" | "seller";
  onSubmitRating: (rating: 1 | -1, comment: string) => void;
  isCompact?: boolean;
}

interface RatingFormData {
  comment: string;
}

export function RatingAction({
  otherPartyRole,
  onSubmitRating,
  isCompact = false,
}: RatingActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<1 | -1>(1);
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<RatingFormData>();

  const handleSubmit = (data: RatingFormData) => {
    if (!data.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }
    onSubmitRating(selectedRating, data.comment);
    setDialogOpen(false);
    reset();
  };

  return (
    <>
      <div className={isCompact ? "" : "space-y-3"}>
        {!isCompact && (
          <Alert>
            <AlertDescription className="text-xs sm:text-sm">
              Đánh giá giao dịch để hoàn tất đơn hàng
            </AlertDescription>
          </Alert>
        )}
        <Button
          onClick={() => setDialogOpen(true)}
          className={isCompact ? "w-full text-sm" : "w-full"}
          variant="default"
        >
          Đánh giá{" "}
          {isCompact
            ? ""
            : `người ${otherPartyRole === "buyer" ? "mua" : "bán"}`}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Đánh giá giao dịch
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              Đánh giá của bạn sẽ ảnh hưởng đến uy tín của người{" "}
              {otherPartyRole === "buyer" ? "mua" : "bán"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <Button
                variant={selectedRating === 1 ? "default" : "outline"}
                size="default"
                onClick={() => setSelectedRating(1)}
                className="w-full sm:w-auto"
              >
                <ThumbsUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Tốt (+1)
              </Button>
              <Button
                variant={selectedRating === -1 ? "destructive" : "outline"}
                size="default"
                onClick={() => setSelectedRating(-1)}
                className="w-full sm:w-auto"
              >
                <ThumbsDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Không tốt (-1)
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ratingComment">Nhận xét</Label>
              <Textarea
                id="ratingComment"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                {...register("comment", {
                  required: "Vui lòng nhập nhận xét",
                })}
              />
              {errors.comment && (
                <p className="text-sm text-destructive">
                  {errors.comment.message}
                </p>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => reset()}>
              Để sau
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleFormSubmit(handleSubmit)}>
              Gửi đánh giá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
