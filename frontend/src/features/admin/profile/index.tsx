import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { profileAPI } from "@/services/profile.api";
import { imageAPI } from "@/services/image.api";
import { PageLoader } from "@/components/PageLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Lock, Camera } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { EditProfileForm } from "./components/EditProfileForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "../types";

export default function AdminProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await profileAPI.getMe();
      setProfileData(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Không thể tải thông tin người dùng");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onUpdateProfile = async (data: UpdateProfileData) => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      const updatedProfile = await profileAPI.updateProfile(
        profileData.userid,
        data
      );
      setProfileData(updatedProfile);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!profileData?.userid) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    setIsLoading(true);
    try {
      await profileAPI.changePassword(profileData.userid, {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = async (files: File | File[]) => {
    try {
      const file = Array.isArray(files) ? files[0] : files;
      const uploadResult = await imageAPI.uploadSingle(file);

      if (!profileData?.userid) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      await profileAPI.updateProfile(profileData.userid, {
        anhDaiDien: uploadResult.url,
      });

      setProfileData({ ...profileData, anhDaiDien: uploadResult.url });
      toast.success("Cập nhật ảnh đại diện thành công!");
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Upload ảnh thất bại. Vui lòng thử lại!"
      );
      throw error;
    }
  };

  if (isLoadingProfile) {
    return <PageLoader />;
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Không tìm thấy thông tin người dùng
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                <AvatarImage
                  src={profileData.anhDaiDien}
                  alt={user?.username}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {profileData.hoVaTen?.charAt(0)?.toUpperCase() ||
                    user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
                    <DialogDescription>
                      Chọn ảnh từ máy và xác nhận để cập nhật ảnh đại diện của
                      bạn
                    </DialogDescription>
                  </DialogHeader>
                  <ImageUploader
                    mode="single"
                    currentImage={profileData.anhDaiDien}
                    onUploadComplete={handleUploadComplete}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-2">
                {profileData.hoVaTen || user?.username}
              </h1>
              <p className="text-muted-foreground mb-3">{profileData.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="destructive" className="px-3 py-1">
                  Quản trị viên
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  @{user?.username}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Management Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Đổi mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa thông tin</CardTitle>
            </CardHeader>
            <CardContent>
              <EditProfileForm
                profile={profileData}
                onSubmit={onUpdateProfile}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Thay đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm
                onSubmit={onChangePassword}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
