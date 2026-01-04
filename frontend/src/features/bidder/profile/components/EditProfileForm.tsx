import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux";
import { userAPI } from "@/services/user.api";
import { imageAPI } from "@/services/image.api";
import { getUserMe } from "@/store/slices/authSlice";

interface ProfileFormData {
  hoVaTen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  ngaySinh: string;
}

export function EditProfileForm() {
  const dispatch = useAppDispatch();
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(reduxUser);

  // Fetch fresh user data from API on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getMe();
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to Redux data if API fails
        setCurrentUser(reduxUser);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [reduxUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      hoVaTen: currentUser?.hoVaTen || "",
      email: currentUser?.email || "",
      soDienThoai: currentUser?.soDienThoai || "",
      diaChi: currentUser?.diaChi || "",
      ngaySinh: currentUser?.ngaySinh || "",
    },
  });

  // Update form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      reset({
        hoVaTen: currentUser.hoVaTen || "",
        email: currentUser.email || "",
        soDienThoai: currentUser.soDienThoai || "",
        diaChi: currentUser.diaChi || "",
        ngaySinh: currentUser.ngaySinh || "",
      });
    }
  }, [currentUser, reset]);

  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      if (!currentUser?.userid) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      try {
        setIsSubmitting(true);

        let avatarUrl =
          data.email === currentUser.email ? currentUser.anhDaiDien : undefined;

        // Upload avatar if selected
        if (avatarFile) {
          try {
            const uploadResponse = await imageAPI.uploadSingle(avatarFile);
            avatarUrl = uploadResponse.url;
          } catch (uploadError) {
            console.error("Error uploading avatar:", uploadError);
            toast.error("Không thể tải lên ảnh đại diện");
            return;
          }
        }

        // Update user profile
        const updateData = {
          hoVaTen: data.hoVaTen,
          soDienThoai: data.soDienThoai || undefined,
          diaChi: data.diaChi || undefined,
          ngaySinh: data.ngaySinh || undefined,
          anhDaiDien: avatarUrl,
        };

        await userAPI.update(currentUser.userid, updateData);

        // Refresh user in Redux
        await dispatch(getUserMe());

        toast.success("Cập nhật thông tin thành công!");
        setAvatarFile(null);
        setAvatarPreview(null);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser, avatarFile, dispatch]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải thông tin...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 pb-4 border-b">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                <AvatarImage
                  src={avatarPreview || currentUser?.anhDaiDien}
                  alt={currentUser?.username}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Thay đổi ảnh đại diện
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Đã chọn: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>

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
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
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
                  className="pl-10 min-h-25"
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
    </div>
  );
}
