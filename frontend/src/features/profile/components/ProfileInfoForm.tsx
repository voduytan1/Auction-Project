import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import type { UserProfile, UpdateProfileData } from "../types";

interface ProfileInfoFormProps {
  profileData: UserProfile;
  onSubmit: (data: UpdateProfileData) => void;
  isLoading: boolean;
  onOpenPasswordDialog: () => void;
}

export function ProfileInfoForm({
  profileData,
  onSubmit,
  isLoading,
  onOpenPasswordDialog,
}: ProfileInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    values: {
      hoVaTen: profileData?.hoVaTen || "",
      email: profileData?.email || "",
      diaChi: profileData?.diaChi || "",
      soDienThoai: profileData?.soDienThoai || "",
      ngaySinh: profileData?.ngaySinh || "",
    },
  });

  // Reset form when profileData changes
  useEffect(() => {
    if (profileData) {
      console.log("ProfileData changed, resetting form:", profileData);
      reset({
        hoVaTen: profileData.hoVaTen || "",
        email: profileData.email || "",
        diaChi: profileData.diaChi || "",
        soDienThoai: profileData.soDienThoai || "",
        ngaySinh: profileData.ngaySinh || "",
      });
    }
  }, [profileData, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hoVaTen">Họ và tên</Label>
            <Input
              id="hoVaTen"
              {...register("hoVaTen")}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={profileData.username}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaitro">Quyền</Label>
            <Input
              id="vaitro"
              value={profileData.vaitro}
              disabled
              className="bg-muted capitalize"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaChi">Địa chỉ</Label>
            <Input
              id="diaChi"
              {...register("diaChi")}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soDienThoai">Số điện thoại</Label>
            <Input
              id="soDienThoai"
              type="tel"
              {...register("soDienThoai", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số",
                },
              })}
              placeholder="Nhập số điện thoại (10 chữ số)"
            />
            {errors.soDienThoai && (
              <p className="text-sm text-destructive">
                {errors.soDienThoai.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ngaySinh">Ngày sinh</Label>
            <Input id="ngaySinh" type="date" {...register("ngaySinh")} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Đang lưu..." : "Cập nhật thông tin"}
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={onOpenPasswordDialog}
            >
              <Lock className="h-4 w-4 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
