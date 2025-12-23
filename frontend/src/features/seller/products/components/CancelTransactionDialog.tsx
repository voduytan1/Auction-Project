import { useState } from "react";
import { useForm } from "react-hook-form";
import { XCircle, AlertTriangle, User, Star } from "lucide-react";
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

interface CancelTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  winnerId: string;
  winnerName: string;
  finalBid: number;
}

interface CancelFormData {
  reason: string;
}

export function CancelTransactionDialog({
  open,
  onOpenChange,
  productId,
  productName,
  winnerId,
  winnerName,
  finalBid,
}: CancelTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CancelFormData>();

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: CancelFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to cancel transaction
      // await transactionApi.cancel(productId, winnerId, data.reason);

      console.log("Canceling transaction:", {
        productId,
        winnerId,
        reason: data.reason,
        ratingPenalty: -1, // Auto -1 rating
      });

      // Auto apply -1 rating to winner
      toast.success(
        `Đã hủy giao dịch với ${winnerName}. Rating tự động trừ 1 điểm.`
      );

      handleClose();
    } catch (error) {
      console.error("Error canceling transaction:", error);
      toast.error("Không thể hủy giao dịch. Vui lòng thử lại!");
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
            <XCircle className="h-5 w-5 text-destructive" />
            Hủy giao dịch
          </DialogTitle>
          <DialogDescription>
            Hủy giao dịch cho sản phẩm: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Winner Info */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{winnerName}</span>
              </div>
              <span className="font-bold text-lg">{formatPrice(finalBid)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-destructive" />
              <span>Người thắng đấu giá (sẽ bị trừ 1 điểm rating)</span>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do hủy giao dịch <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              className="min-h-[120px]"
              {...register("reason", {
                required: "Vui lòng nhập lý do hủy giao dịch",
                minLength: {
                  value: 10,
                  message: "Lý do phải có ít nhất 10 ký tự",
                },
                maxLength: {
                  value: 500,
                  message: "Lý do không được quá 500 ký tự",
                },
              })}
              placeholder="Ví dụ: Người mua không thanh toán đúng hạn, vi phạm thỏa thuận..."
            />
            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Warning Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Cảnh báo:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  Người mua sẽ bị trừ <strong>1 điểm rating</strong> tự động
                </li>
                <li>
                  Điểm rating thấp sẽ ảnh hưởng đến khả năng đấu giá trong tương
                  lai
                </li>
                <li>Giao dịch sẽ chuyển sang trạng thái "Đã hủy"</li>
                <li>Hành động này không thể hoàn tác</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Confirmation Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Vui lòng đảm bảo bạn đã thử liên hệ và giải quyết vấn đề với người
              mua trước khi hủy giao dịch.
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
              <XCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy giao dịch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
