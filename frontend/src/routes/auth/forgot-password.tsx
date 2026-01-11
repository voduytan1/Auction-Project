import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
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
import { authAPI } from "@/services/auth.api";
import {
  forgotPasswordEmailSchema,
  forgotPasswordResetSchema,
  type ForgotPasswordEmailFormData,
  type ForgotPasswordResetFormData,
} from "@/features/profile/schemas/validation";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm<ForgotPasswordResetFormData>({
    resolver: zodResolver(forgotPasswordResetSchema),
  });

  const onRequestOTP = async (data: ForgotPasswordEmailFormData) => {
    setIsLoading(true);
    try {
      await authAPI.sendOtp(data.email);
      setEmail(data.email);
      setStep("otp");
      toast.success("OTP đã được gửi đến email của bạn!");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Gửi OTP thất bại";
      toast.error(errorMessage);
      console.error("Send OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ForgotPasswordResetFormData) => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA chưa sẵn sàng. Vui lòng thử lại!");
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");
      await authAPI.forgotPassword(
        email,
        data.otp,
        data.newPassword,
        recaptchaToken
      );
      toast.success("Đặt lại mật khẩu thành công! Đang đăng nhập...");
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Đặt lại mật khẩu thất bại";
      toast.error(errorMessage);
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            noValidate
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
                {...registerEmail("email")}
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
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email-display">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email-display"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">
                <KeyRound className="h-4 w-4 inline mr-2" />
                Mã OTP
              </Label>
              <Input
                id="otp"
                placeholder="Nhập mã OTP từ email"
                {...registerReset("otp")}
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
                {...registerReset("newPassword")}
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
                {...registerReset("confirmPassword")}
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
  );
}
