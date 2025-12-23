import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Info,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/use-redux";

interface PlaceBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentPrice: number;
  minBidStep: number;
  userPoints: number;
  sellerAllowsLowRating?: boolean; // If seller allows bidders with <80% rating
}

interface BidFormData {
  bidAmount: number;
}

export function PlaceBidDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentPrice,
  minBidStep,
  userPoints,
  sellerAllowsLowRating = false,
}: PlaceBidDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);

  const minBidAmount = currentPrice + minBidStep;

  // Rating validation
  const userRating = currentUser?.tyLeDanhGiaTot ?? 0;
  const MIN_REQUIRED_RATING = 80;
  const hasMinRating = userRating >= MIN_REQUIRED_RATING;
  const canBid = hasMinRating || sellerAllowsLowRating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<BidFormData>({
    defaultValues: {
      bidAmount: minBidAmount,
    },
  });

  const bidAmount = watch("bidAmount");
  const hasEnoughPoints = bidAmount <= userPoints;

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: BidFormData) => {
    // Check rating first
    if (!canBid) {
      toast.error(
        "Tỷ lệ đánh giá của bạn không đủ 80% để đặt giá. Vui lòng cải thiện uy tín!"
      );
      return;
    }

    if (!hasEnoughPoints) {
      toast.error("Điểm của bạn không đủ để đặt giá này!");
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Call API to place bid
      // await bidApi.placeBid(productId, data.bidAmount);

      console.log("Placing bid:", {
        productId,
        bidAmount: data.bidAmount,
        userRating,
      });

      toast.success("Đặt giá thành công!");
      handleClose();
      // Refresh product details
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Không thể đặt giá. Vui lòng thử lại!");
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
            <TrendingUp className="h-5 w-5" />
            Đặt giá đấu giá
          </DialogTitle>
          <DialogDescription>
            Đặt giá cho sản phẩm: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating Validation Warning */}
          {!canBid && (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Không đủ điều kiện đặt giá!</strong>
                <p className="mt-1">
                  Tỷ lệ đánh giá tốt của bạn là {userRating}%, cần tối thiểu 80%
                  để được đặt giá.
                  {sellerAllowsLowRating
                    ? " Người bán đã cho phép người dùng có rating thấp."
                    : " Người bán không cho phép người dùng có rating thấp đặt giá."}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Current Price Info */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Giá hiện tại:</span>
              <span className="font-bold text-lg">
                {formatPrice(currentPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bước giá tối thiểu:</span>
              <span className="font-medium">{formatPrice(minBidStep)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Điểm hiện có:</span>
              <span className="font-medium">{userPoints.toLocaleString()}</span>
            </div>
          </div>

          {/* Bid Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount">
              Giá đặt <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bidAmount"
                type="number"
                step={minBidStep}
                className="pl-10"
                {...register("bidAmount", {
                  required: "Vui lòng nhập giá đặt",
                  valueAsNumber: true,
                  min: {
                    value: minBidAmount,
                    message: `Giá đặt tối thiểu là ${formatPrice(
                      minBidAmount
                    )}`,
                  },
                  validate: {
                    validStep: (value) => {
                      const diff = value - currentPrice;
                      if (diff % minBidStep !== 0) {
                        return `Giá đặt phải tăng theo bội số của ${formatPrice(
                          minBidStep
                        )}`;
                      }
                      return true;
                    },
                  },
                })}
                placeholder={formatPrice(minBidAmount)}
              />
            </div>
            {errors.bidAmount && (
              <p className="text-sm text-destructive">
                {errors.bidAmount.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Giá đặt tối thiểu: {formatPrice(minBidAmount)}
            </p>
          </div>

          {/* Points Warning */}
          {!hasEnoughPoints && bidAmount && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Điểm của bạn không đủ để đặt giá này. Vui lòng giảm giá đặt hoặc
                nạp thêm điểm.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>
                  Giá đặt phải cao hơn giá hiện tại ít nhất{" "}
                  {formatPrice(minBidStep)}
                </li>
                <li>Điểm sẽ bị khóa cho đến khi đấu giá kết thúc</li>
                <li>Nếu bị trả giá cao hơn, điểm sẽ được hoàn lại</li>
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
            <Button
              type="submit"
              disabled={isSubmitting || !hasEnoughPoints || !canBid}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt giá"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
