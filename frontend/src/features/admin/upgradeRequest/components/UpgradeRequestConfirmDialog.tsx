import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UpgradeRequestResponse } from "@/services/admin.api";

interface UpgradeRequestConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: UpgradeRequestResponse | null;
  action: "approve" | "reject" | null;
  onConfirm: () => void;
}

export function UpgradeRequestConfirmDialog({
  open,
  onOpenChange,
  request,
  action,
  onConfirm,
}: UpgradeRequestConfirmDialogProps) {
  if (!request || !action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "approve"
              ? "Xác nhận duyệt yêu cầu"
              : "Xác nhận từ chối yêu cầu"}
          </DialogTitle>
          <DialogDescription>
            {action === "approve" ? (
              <>
                Bạn có chắc chắn muốn duyệt yêu cầu nâng cấp của{" "}
                <strong>{request.username}</strong> lên Seller?
                <br />
                <br />
                Sau khi duyệt, user này sẽ có quyền tạo và quản lý sản phẩm đấu
                giá.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn từ chối yêu cầu nâng cấp của{" "}
                <strong>{request.username}</strong>?
                <br />
                <br />
                User sẽ nhận được thông báo về việc từ chối và có thể gửi yêu
                cầu mới sau này.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant={action === "reject" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {action === "approve" ? "Duyệt" : "Từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
