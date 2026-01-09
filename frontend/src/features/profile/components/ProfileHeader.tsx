import { useState } from "react";
import { ShoppingBag, Star, Camera } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/ImageUploader";
import { imageAPI } from "@/services/image.api";
import { profileAPI } from "@/services/profile.api";
import type { UserProfile, RatingStats } from "../types";

interface ProfileHeaderProps {
  profileData: UserProfile;
  ratingStats: RatingStats | null;
  onRequestUpgrade: () => void;
  onAvatarUpdate: (newAvatar: string) => void;
}

export function ProfileHeader({
  profileData,
  ratingStats,
  onRequestUpgrade,
  onAvatarUpdate,
}: ProfileHeaderProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUploadComplete = async (files: File | File[]) => {
    try {
      // Single file for avatar
      const file = Array.isArray(files) ? files[0] : files;

      // Upload image to Cloudinary (takes a few seconds)
      const uploadResult = await imageAPI.uploadSingle(file);

      // Guard check and log
      console.log("Profile data:", profileData);
      if (!profileData?.userid) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Update profile with new avatar URL
      await profileAPI.updateProfile(profileData.userid, {
        anhDaiDien: uploadResult.url,
      });

      // Update local state
      onAvatarUpdate(uploadResult.url);

      toast.success("Cập nhật ảnh đại diện thành công!");
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Upload ảnh thất bại. Vui lòng thử lại!"
      );
      throw error; // Re-throw to let ImageUploader know it failed
    }
  };

  return (
    <Card className="mb-4 sm:mb-6 lg:mb-8">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
              <AvatarImage
                src={profileData.anhDaiDien}
                alt={profileData.username}
              />
              <AvatarFallback className="text-3xl sm:text-4xl">
                {profileData.username.charAt(0).toUpperCase()}
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
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
                  <DialogDescription>
                    Chọn ảnh từ máy và xác nhận để cập nhật ảnh đại diện của bạn
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

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {profileData.hoVaTen}
            </h1>
            <p className="text-muted-foreground mb-3">
              @{profileData.username}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="outline" className="capitalize">
                {profileData.vaitro}
              </Badge>
              {ratingStats && (
                <Badge
                  variant={
                    ratingStats.percentage >= 80 ? "default" : "destructive"
                  }
                >
                  <Star className="h-3 w-3 mr-1" />
                  {ratingStats.percentage.toFixed(0)}% ({ratingStats.total} đánh
                  giá)
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {profileData.vaitro === "BIDDER" && (
              <Button
                onClick={onRequestUpgrade}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Yêu cầu nâng cấp Seller
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
