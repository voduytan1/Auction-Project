import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Not used currently
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ShoppingBag,
  Lock,
  Camera,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { profileAPI } from "@/services/profile.api";
import type {
  UpdateProfileData,
  ChangePasswordData,
  UserRating,
  RatingStats,
} from "./types";

export default function ProfilePage() {
  // const navigate = useNavigate(); // Not used currently
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);

  // Form for profile update
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      hoVaTen: user?.hoVaTen || "",
      email: user?.email || "",
    },
  });

  // Form for password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch,
  } = useForm<ChangePasswordData>();

  const newPassword = watch("newPassword");

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const ratingsData = await profileAPI.getMyRatings();
      setRatings(ratingsData.ratings);
      setRatingStats(ratingsData.stats);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onUpdateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const updatedProfile = await profileAPI.updateProfile(data);

      // Update Redux state
      if (user) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              hoVaTen: updatedProfile.hoVaTen,
              email: updatedProfile.email,
            },
            token: localStorage.getItem("accessToken") || "",
          })
        );
      }

      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
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
      resetPassword();
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestUpgrade = async () => {
    try {
      await profileAPI.requestUpgradeToSeller();
      toast.success("Đã gửi yêu cầu nâng cấp tài khoản!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gửi yêu cầu thất bại");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-4xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <p className="text-muted-foreground mb-3">@{user.username}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {user.vaitro}
                </Badge>
                {ratingStats && (
                  <Badge
                    variant={
                      ratingStats.percentage >= 80 ? "default" : "destructive"
                    }
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {ratingStats.percentage.toFixed(0)}% ({ratingStats.total}{" "}
                    đánh giá)
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {user.vaitro === "BIDDER" && (
                <Button onClick={handleRequestUpgrade} variant="outline">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Yêu cầu nâng cấp Seller
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Thông tin cá nhân */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitProfile(onUpdateProfile)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="hoVaTen">Họ và tên</Label>
                <Input
                  id="hoVaTen"
                  {...registerProfile("hoVaTen")}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={user.username}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaitro">Quyền</Label>
                <Input
                  id="vaitro"
                  value={user.vaitro}
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
                  {...registerProfile("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                  placeholder="email@example.com"
                />
                {errorsProfile.email && (
                  <p className="text-sm text-destructive">
                    {errorsProfile.email.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Đang lưu..." : "Cập nhật thông tin"}
                </Button>

                {/* Change Password Dialog */}
                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Đổi mật khẩu</DialogTitle>
                      <DialogDescription>
                        Nhập mật khẩu cũ và mật khẩu mới của bạn
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitPassword(onChangePassword)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          {...registerPassword("oldPassword", {
                            required: "Mật khẩu cũ là bắt buộc",
                          })}
                          placeholder="Nhập mật khẩu cũ"
                        />
                        {errorsPassword.oldPassword && (
                          <p className="text-sm text-destructive">
                            {errorsPassword.oldPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...registerPassword("newPassword", {
                            required: "Mật khẩu mới là bắt buộc",
                            minLength: {
                              value: 6,
                              message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                          })}
                          placeholder="Nhập mật khẩu mới"
                        />
                        {errorsPassword.newPassword && (
                          <p className="text-sm text-destructive">
                            {errorsPassword.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...registerPassword("confirmPassword", {
                            required: "Xác nhận mật khẩu là bắt buộc",
                            validate: (value) =>
                              value === newPassword ||
                              "Mật khẩu xác nhận không khớp",
                          })}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        {errorsPassword.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {errorsPassword.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPasswordDialogOpen(false)}
                          className="flex-1"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Điểm đánh giá */}
        <Card>
          <CardHeader>
            <CardTitle>Điểm đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingStats ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold mb-2">
                    {ratingStats.percentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tổng {ratingStats.total} đánh giá
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Tích cực</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {ratingStats.positive}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Tiêu cực</span>
                    </div>
                    <Badge variant="outline" className="text-red-600">
                      {ratingStats.negative}
                    </Badge>
                  </div>
                </div>

                {ratingStats.percentage < 80 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Bạn cần có ít nhất 80% đánh giá tích cực để tham gia đấu
                      giá
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có đánh giá</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rating history */}
      {ratings.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lịch sử đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={rating.fromUser.avatar} />
                    <AvatarFallback>
                      {rating.fromUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {rating.fromUser.username}
                      </span>
                      {rating.type === "like" ? (
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground">
                        {rating.comment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
