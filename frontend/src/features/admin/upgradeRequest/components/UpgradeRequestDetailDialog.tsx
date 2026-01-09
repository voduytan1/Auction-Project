import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import type { UpgradeRequestResponse } from "@/services/admin.api";

interface UpgradeRequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: UpgradeRequestResponse | null;
  onApprove?: () => void;
  onReject?: () => void;
}

export function UpgradeRequestDetailDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: UpgradeRequestDetailDialogProps) {
  if (!request) return null;

  const handleApprove = () => {
    onApprove?.();
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu nâng cấp</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu nâng cấp tài khoản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium">Người dùng</div>
            <div className="text-sm text-muted-foreground">
              @{request.username}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">User ID</div>
            <div className="text-sm text-muted-foreground font-mono">
              {request.userid}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Trạng thái</div>
            <div className="mt-1">
              <Badge
                variant={
                  request.trangThai === "PENDING"
                    ? "secondary"
                    : request.trangThai === "APPROVED"
                    ? "default"
                    : "destructive"
                }
              >
                {request.trangThai === "PENDING"
                  ? "Chờ duyệt"
                  : request.trangThai === "APPROVED"
                  ? "Đã duyệt"
                  : "Đã từ chối"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          {request.trangThai === "PENDING" && (
            <>
              <Button variant="outline" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button onClick={handleApprove}>
                <Check className="h-4 w-4 mr-2" />
                Duyệt
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
