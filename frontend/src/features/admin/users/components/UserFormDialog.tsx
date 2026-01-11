import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { User } from "@/features/auth/types";

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  hoVaTen: string;
  anhDaiDien?: string;
  vaitro?: "BIDDER" | "SELLER" | "ADMIN";
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  isSubmitting: boolean;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  isSubmitting,
  onSubmit,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      hoVaTen: "",
      anhDaiDien: "",
      vaitro: "BIDDER",
    },
  });

  useEffect(() => {
    if (open) {
      if (editingUser) {
        reset({
          username: editingUser.username,
          email: editingUser.email,
          hoVaTen: editingUser.hoVaTen || "",
          anhDaiDien: editingUser.anhDaiDien || "",
          vaitro: editingUser.vaitro,
        });
      } else {
        reset({
          username: "",
          email: "",
          password: "",
          hoVaTen: "",
          anhDaiDien: "",
          vaitro: "BIDDER",
        });
      }
    }
  }, [open, editingUser, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Chỉnh sửa" : "Thêm"} người dùng
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Cập nhật thông tin người dùng"
              : "Tạo người dùng mới trong hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              {...register("username", {
                required: "Username là bắt buộc",
                minLength: {
                  value: 3,
                  message: "Username tối thiểu 3 ký tự",
                },
                maxLength: { value: 50, message: "Username tối đa 50 ký tự" },
              })}
              placeholder="Nhập username"
              disabled={!!editingUser}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ",
                },
              })}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: !editingUser ? "Mật khẩu là bắt buộc" : false,
                  minLength: {
                    value: 6,
                    message: "Mật khẩu tối thiểu 6 ký tự",
                  },
                  maxLength: {
                    value: 100,
                    message: "Mật khẩu tối đa 100 ký tự",
                  },
                })}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hoVaTen">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hoVaTen"
              {...register("hoVaTen", {
                required: "Họ và tên là bắt buộc",
                maxLength: {
                  value: 100,
                  message: "Họ và tên tối đa 100 ký tự",
                },
              })}
              placeholder="Nhập họ và tên"
            />
            {errors.hoVaTen && (
              <p className="text-sm text-destructive">
                {errors.hoVaTen.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="anhDaiDien">Ảnh đại diện (URL)</Label>
            <Input
              id="anhDaiDien"
              {...register("anhDaiDien")}
              placeholder="Nhập URL ảnh đại diện"
            />
          </div>

          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="vaitro">Vai trò</Label>
              <Controller
                name="vaitro"
                control={control}
                defaultValue="BIDDER"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BIDDER">Người đấu giá</SelectItem>
                      <SelectItem value="SELLER">Người bán</SelectItem>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
