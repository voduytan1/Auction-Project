import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, History, FileText } from "lucide-react";
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

interface DescriptionHistory {
  id: string;
  content: string;
  appendedAt: string;
}

// Mock history data
const mockHistory: DescriptionHistory[] = [
  {
    id: "1",
    content:
      "Cập nhật: Sản phẩm đã được test đầy đủ các tính năng, hoạt động tốt 100%",
    appendedAt: "2024-12-22T10:30:00",
  },
  {
    id: "2",
    content: "Lưu ý: Đã thêm phụ kiện tai nghe và sạc nhanh vào gói sản phẩm",
    appendedAt: "2024-12-21T15:45:00",
  },
];

export function AppendDescriptionDialog({
  open,
  onOpenChange,
  productId,
  productName,
  currentDescription,
}: AppendDescriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppendFormData>();

  const handleClose = () => {
    reset();
    setShowHistory(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: AppendFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to append description
      // await productApi.appendDescription(productId, data.additionalDescription);

      console.log("Appending description:", {
        productId,
        additionalDescription: data.additionalDescription,
        timestamp: new Date().toISOString(),
      });

      toast.success("Đã bổ sung mô tả thành công!");
      handleClose();
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
            >
              <History className="h-4 w-4 mr-2" />
              {showHistory ? "Ẩn lịch sử bổ sung" : "Xem lịch sử bổ sung"}
            </Button>

            {showHistory && (
              <div className="rounded-lg border p-3 space-y-3 max-h-[200px] overflow-y-auto">
                {mockHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có lịch sử bổ sung
                  </p>
                ) : (
                  mockHistory.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.appendedAt)}
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
