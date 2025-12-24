import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, History, FileText, Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  productAPI,
  type DescriptionHistoryResponse,
} from "@/services/product.api";

interface AppendDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentDescription: string;
}

interface AppendFormData {
  additionalDescription: string;
}

export function AppendDescriptionDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentDescription,
}: AppendDescriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<DescriptionHistoryResponse[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppendFormData>();

  // Load history when dialog opens
  useEffect(() => {
    if (open && showHistory) {
      loadHistory();
    }
  }, [open, showHistory]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await productAPI.getDescriptionHistory(productId);
      setHistory(data.data);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Không thể tải lịch sử bổ sung!");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowHistory(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: AppendFormData) => {
    try {
      setIsSubmitting(true);

      // Call API to append description
      await productAPI.appendDescription(productId, data.additionalDescription);

      toast.success("Đã bổ sung mô tả thành công!");

      // Reload history
      if (showHistory) {
        await loadHistory();
      }

      reset();
    } catch (error) {
      console.error("Error appending description:", error);
      toast.error("Không thể bổ sung mô tả. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Bổ sung mô tả sản phẩm
          </DialogTitle>
          <DialogDescription>
            Thêm thông tin bổ sung cho: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Mô tả hiện tại
            </Label>
            <div className="rounded-lg border bg-muted/50 p-3 max-h-[120px] overflow-y-auto">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {currentDescription}
              </p>
            </div>
          </div>

          <Separator />

          {/* Additional Description */}
          <div className="space-y-2">
            <Label htmlFor="additionalDescription">
              Nội dung bổ sung <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="additionalDescription"
              className="min-h-[120px]"
              {...register("additionalDescription", {
                required: "Vui lòng nhập nội dung bổ sung",
                minLength: {
                  value: 10,
                  message: "Nội dung phải có ít nhất 10 ký tự",
                },
                maxLength: {
                  value: 1000,
                  message: "Nội dung không được quá 1000 ký tự",
                },
              })}
              placeholder="Nhập thông tin bổ sung về sản phẩm..."
            />
            {errors.additionalDescription && (
              <p className="text-sm text-destructive">
                {errors.additionalDescription.message}
              </p>
            )}
          </div>

          {/* Info Alert */}
          <Alert>
            <Plus className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Nội dung bổ sung sẽ được thêm vào cuối mô tả hiện tại và không thể
              xóa. Lịch sử bổ sung sẽ được lưu lại để theo dõi.
            </AlertDescription>
          </Alert>

          {/* Description History */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowHistory(!showHistory)}
              disabled={isLoadingHistory}
            >
              <History className="h-4 w-4 mr-2" />
              {isLoadingHistory
                ? "Đang tải..."
                : showHistory
                ? "Ẩn lịch sử bổ sung"
                : "Xem lịch sử bổ sung"}
            </Button>

            {showHistory && (
              <div className="rounded-lg border p-3 space-y-3 max-h-[200px] overflow-y-auto">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Đang tải...
                    </span>
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có lịch sử bổ sung
                  </p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.appendedAt)} - bởi {item.appendedBy}
                      </p>
                      <p className="text-sm">{item.content}</p>
                      <Separator className="mt-2" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

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
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Bổ sung mô tả"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
