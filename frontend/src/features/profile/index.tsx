import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { profileAPI } from "@/services/profile.api";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInfoForm } from "./components/ProfileInfoForm";
import { ChangePasswordDialog } from "./components/ChangePasswordDialog";
import { RatingStatsCard } from "./components/RatingStatsCard";
import { RatingHistoryCard } from "./components/RatingHistoryCard";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  UserRating,
  RatingStats,
} from "./types";
import { PageLoader } from "@/components/PageLoader";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Fetch full profile data from API
      const userData = await profileAPI.getMe();
      console.log("User data from /users/me:", userData);
      setProfileData(userData);

      // Fetch ratings only if we have a valid user ID
      if (userData?.userid) {
        const ratingsData = await profileAPI.getMyRatings(userData.userid);
        setRatings(ratingsData.ratings);
        setRatingStats({
          ...ratingsData.stats,
          total: ratingsData.stats.positive + ratingsData.stats.negative,
        });
      }
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

      console.log("Updated profile from API:", updatedProfile);

      // Update local state
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

    setIsLoading(true);
    try {
      await profileAPI.changePassword(data);
      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordDialogOpen(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestUpgrade = async () => {
    try {
      await profileAPI.requestUpgradeToSeller();
      toast.success("Đã gửi yêu cầu nâng cấp tài khoản!");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Gửi yêu cầu thất bại");
    }
  };

  if (!profileData || isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <PageLoader message="Đang tải thông tin..." className="py-32" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header Card */}
      <ProfileHeader
        profileData={profileData}
        ratingStats={ratingStats}
        onRequestUpgrade={handleRequestUpgrade}
        onAvatarUpdate={(newAvatar) => {
          // Update local state
          setProfileData({ ...profileData, anhDaiDien: newAvatar });

          // Update Redux store to sync with Header
          dispatch(
            setCredentials({
              user: {
                ...profileData,
                anhDaiDien: newAvatar,
              },
              accessToken: accessToken || "",
            })
          );
        }}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Thông tin cá nhân */}
        <ProfileInfoForm
          profileData={profileData}
          onSubmit={onUpdateProfile}
          isLoading={isLoading}
          onOpenPasswordDialog={() => setIsPasswordDialogOpen(true)}
        />

        {/* Điểm đánh giá */}
        <RatingStatsCard ratingStats={ratingStats} />
      </div>

      {/* Rating history */}
      <div className="mt-6">
        <RatingHistoryCard ratings={ratings} />
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSubmit={onChangePassword}
        isLoading={isLoading}
      />
    </div>
  );
}
