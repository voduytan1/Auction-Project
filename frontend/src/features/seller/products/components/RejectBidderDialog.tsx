import { useState } from "react";
import { useForm } from "react-hook-form";
import { Ban, AlertTriangle, User, TrendingUp } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface RejectBidderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentBidder: {
    userId: string;
    username: string;
    currentBid: number;
  };
  secondHighestBidder?: {
    userId: string;
    username: string;
    bidAmount: number;
  };
}

interface RejectFormData {
  reason: string;
}

export function RejectBidderDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentBidder,
  secondHighestBidder,
}: RejectBidderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectFormData>();

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: RejectFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to reject bidder
      // await productApi.rejectBidder(productId, currentBidder.userId, data.reason);

      console.log("Rejecting bidder:", {
        productId,
        rejectedUserId: currentBidder.userId,
        reason: data.reason,
        newWinnerId: secondHighestBidder?.userId,
      });

      // Auto move to second highest bidder
      if (secondHighestBidder) {
        toast.success(
          `Đã từ chối ${currentBidder.username} và chuyển sang ${secondHighestBidder.username}`
        );
      } else {
        toast.success(`Đã từ chối ${currentBidder.username}`);
      }

      handleClose();
    } catch (error) {
      console.error("Error rejecting bidder:", error);
      toast.error("Không thể từ chối người đấu giá. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Từ chối người đấu giá
          </DialogTitle>
          <DialogDescription>
            Từ chối và thêm vào danh sách đen cho sản phẩm:{" "}
            <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Bidder Info */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{currentBidder.username}</span>
              </div>
              <span className="font-bold text-lg">
                {formatPrice(currentBidder.currentBid)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Người đấu giá hiện tại (sẽ bị từ chối)
            </p>
          </div>

          {/* Second Highest Bidder */}
          {secondHighestBidder ? (
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {secondHighestBidder.username}
                  </span>
                </div>
                <span className="font-bold text-lg">
                  {formatPrice(secondHighestBidder.bidAmount)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Người thứ 2 (sẽ tự động trở thành người thắng)
              </p>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Không có người đấu giá thứ 2. Sản phẩm sẽ không có người thắng
                sau khi từ chối.
              </AlertDescription>
            </Alert>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              className="min-h-[100px]"
              {...register("reason", {
                required: "Vui lòng nhập lý do từ chối",
                minLength: {
                  value: 10,
                  message: "Lý do phải có ít nhất 10 ký tự",
                },
                maxLength: {
                  value: 500,
                  message: "Lý do không được quá 500 ký tự",
                },
              })}
              placeholder="Ví dụ: Vi phạm điều khoản, rating thấp, không uy tín..."
            />
            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Warning Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Lưu ý:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  Người dùng bị từ chối sẽ không thể đấu giá sản phẩm này nữa
                </li>
                <li>
                  {secondHighestBidder
                    ? "Người đấu giá thứ 2 sẽ tự động trở thành người thắng"
                    : "Sản phẩm sẽ không có người thắng"}
                </li>
                <li>Hành động này không thể hoàn tác</li>
              </ul>
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
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              <Ban className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
