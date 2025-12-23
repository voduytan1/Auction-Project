import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/use-redux";

interface ProfileFormData {
  hoVaTen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  ngaySinh: string;
}

export function EditProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      hoVaTen: currentUser?.hoVaTen || "",
      email: currentUser?.email || "",
      soDienThoai: currentUser?.soDienThoai || "",
      diaChi: currentUser?.diaChi || "",
      ngaySinh: currentUser?.ngaySinh || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to update profile
      // await profileApi.updateProfile(data);

      console.log("Updating profile:", data);

      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông tin cá nhân
        </CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="hoVaTen">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="hoVaTen"
                className="pl-10"
                {...register("hoVaTen", {
                  required: "Vui lòng nhập họ và tên",
                  minLength: {
                    value: 3,
                    message: "Họ và tên phải có ít nhất 3 ký tự",
                  },
                })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            {errors.hoVaTen && (
              <p className="text-sm text-destructive">
                {errors.hoVaTen.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="example@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="soDienThoai">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="soDienThoai"
                type="tel"
                className="pl-10"
                {...register("soDienThoai", {
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại phải có 10-11 chữ số",
                  },
                })}
                placeholder="0912345678"
              />
            </div>
            {errors.soDienThoai && (
              <p className="text-sm text-destructive">
                {errors.soDienThoai.message}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="ngaySinh">Ngày sinh</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ngaySinh"
                type="date"
                className="pl-10"
                {...register("ngaySinh")}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="diaChi">Địa chỉ</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="diaChi"
                className="pl-10 min-h-[100px]"
                {...register("diaChi")}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
