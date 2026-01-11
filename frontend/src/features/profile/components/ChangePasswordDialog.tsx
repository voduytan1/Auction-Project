import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChangePasswordData } from "../types";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ChangePasswordData) => void;
  isLoading: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordData>();

  const newPassword = watch("newPassword");

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu cũ và mật khẩu mới của bạn
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input
              id="oldPassword"
              type="password"
              {...register("oldPassword", {
                required: "Mật khẩu cũ là bắt buộc",
              })}
              placeholder="Nhập mật khẩu cũ"
            />
            {errors.oldPassword && (
              <p className="text-sm text-destructive">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword", {
                required: "Mật khẩu mới là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              placeholder="Nhập mật khẩu mới"
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === newPassword || "Mật khẩu xác nhận không khớp",
              })}
              placeholder="Nhập lại mật khẩu mới"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Đang đổi..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
