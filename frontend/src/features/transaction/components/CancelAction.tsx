import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { XCircle } from "lucide-react";
import { toast } from "sonner";

interface CancelActionProps {
  currentUserRole: "buyer" | "seller";
  onCancel: (reason: string) => void;
}

export function CancelAction({ currentUserRole, onCancel }: CancelActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error("Vui lÃ²ng nháº­p lÃ½ do há»§y");
      return;
    }
    onCancel(reason);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">hoặc</span>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={() => setDialogOpen(true)}
        className="w-full"
      >
        <XCircle className="mr-2 h-4 w-4" />
        Hủy giao dịch
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Hủy giao dịch
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              Hành động này không thể hoàn tác. Người{" "}
              {currentUserRole === "seller" ? "mua" : "bán"} sẽ nhận đánh giá -1
              điểm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Lý do hủy</Label>
            <Textarea
              id="cancelReason"
              placeholder="Nhập lý do hủy giao dịch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
