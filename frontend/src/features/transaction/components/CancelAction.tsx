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
import { XCircle } from "lucide-react";

interface CancelActionProps {
  currentUserRole: "buyer" | "seller";
  onCancel: () => void;
}

export function CancelAction({ onCancel }: CancelActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCancel = () => {
    onCancel();
    setDialogOpen(false);
  };

  return (
    <>
      <div className="border-t my-4" />
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
              Người thắng sẽ tự động nhận đánh giá <strong>-1 điểm</strong> với
              nội dung: <em>"Người thắng không thanh toán"</em>.
              <br />
              <br />
              Bạn có chắc chắn muốn hủy giao dịch này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
