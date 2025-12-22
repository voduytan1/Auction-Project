import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { profileAPI } from "@/services/profile.api";

interface ForgotPasswordForm {
  email: string;
}

interface ResetPasswordForm {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<ForgotPasswordForm>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
    watch,
  } = useForm<ResetPasswordForm>();

  const newPassword = watch("newPassword");

  const onRequestOTP = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await profileAPI.requestForgotPassword(data.email);
      setEmail(data.email);
      setStep("otp");
      toast.success("OTP đã được gửi đến email của bạn!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gửi OTP thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      await profileAPI.resetPassword(email, data.otp, data.newPassword);
      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Đặt lại mật khẩu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                step === "otp" ? setStep("email") : navigate("/auth/login")
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Quên mật khẩu</CardTitle>
          </div>
          <CardDescription>
            {step === "email"
              ? "Nhập email để nhận mã OTP"
              : "Nhập mã OTP và mật khẩu mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form
              onSubmit={handleSubmitEmail(onRequestOTP)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...registerEmail("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errorsEmail.email && (
                  <p className="text-sm text-destructive">
                    {errorsEmail.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>

              <div className="text-center text-sm">
                <Link to="/auth/login" className="text-primary hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitReset(onResetPassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="otp">
                  <KeyRound className="h-4 w-4 inline mr-2" />
                  Mã OTP
                </Label>
                <Input
                  id="otp"
                  placeholder="Nhập mã OTP từ email"
                  {...registerReset("otp", {
                    required: "Mã OTP là bắt buộc",
                  })}
                />
                {errorsReset.otp && (
                  <p className="text-sm text-destructive">
                    {errorsReset.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Mật khẩu mới
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  {...registerReset("newPassword", {
                    required: "Mật khẩu mới là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                {errorsReset.newPassword && (
                  <p className="text-sm text-destructive">
                    {errorsReset.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  {...registerReset("confirmPassword", {
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: (value) =>
                      value === newPassword || "Mật khẩu xác nhận không khớp",
                  })}
                />
                {errorsReset.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errorsReset.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
