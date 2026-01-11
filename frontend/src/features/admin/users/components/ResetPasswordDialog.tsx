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
import { AlertTriangle } from "lucide-react";
import type { User } from "@/features/auth/types";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: ResetPasswordDialogProps) {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset mật khẩu người dùng?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bạn có chắc chắn muốn reset mật khẩu cho người dùng{" "}
              <span className="font-semibold text-foreground">
                {user.username}
              </span>
              ?
            </p>
            <p className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                Hệ thống sẽ tự động tạo mật khẩu mới và gửi email thông báo đến{" "}
                <span className="font-semibold text-foreground">
                  {user.email}
                </span>
              </span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Xác nhận Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
