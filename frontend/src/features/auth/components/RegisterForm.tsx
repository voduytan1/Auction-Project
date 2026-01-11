import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
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
import { PageLoader } from "@/components/PageLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/authSlice";
import { registerSchema, type RegisterFormData } from "../schemas/validation";
import { authAPI } from "@/services/auth.api";

export function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const email = watch("email");

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }

    setIsSendingOtp(true);
    try {
      await authAPI.sendOtp(email);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gửi OTP thất bại!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle form submission
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      // Check if OTP was sent
      if (!otpSent) {
        toast.error("Vui lòng nhấn 'Gửi mã' để nhận OTP qua email!");
        return;
      }

      // Check if OTP was entered
      if (!data.otp || data.otp.trim() === "") {
        toast.error("Vui lòng nhập mã OTP đã được gửi đến email của bạn!");
        return;
      }

      if (!executeRecaptcha) {
        toast.error("reCAPTCHA chưa sẵn sàng. Vui lòng thử lại!");
        return;
      }

      try {
        const recaptchaToken = await executeRecaptcha("register");
        const result = await dispatch(
          registerUser({ ...data, recaptchaToken })
        );

        if (registerUser.fulfilled.match(result)) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
          navigate("/auth/login");
        } else if (registerUser.rejected.match(result)) {
          const errorMessage = result.payload as string;
          toast.error(errorMessage || "Đăng ký thất bại. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    },
    [dispatch, navigate, otpSent, executeRecaptcha]
  );

  return (
    <Card className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <PageLoader message="Đang tạo tài khoản..." className="py-0" />
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>Đăng ký để bắt đầu tham gia đấu giá</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendOtp();
                }}
                disabled={isSendingOtp || countdown > 0 || !email}
              >
                {countdown > 0
                  ? `${countdown}s`
                  : isSendingOtp
                  ? "Đang gửi..."
                  : otpSent
                  ? "Gửi lại"
                  : "Gửi mã"}
              </Button>
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Nhập mã OTP từ email"
                maxLength={6}
                {...register("otp")}
              />
              {errors.otp && (
                <p className="text-sm text-destructive">{errors.otp.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Mã OTP đã được gửi đến email của bạn
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hoVaTen">Họ và tên</Label>
            <Input
              id="hoVaTen"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register("hoVaTen")}
            />
            {errors.hoVaTen && (
              <p className="text-sm text-destructive">
                {errors.hoVaTen.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc đăng ký với
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex justify-center">
            <GoogleLoginButton disabled={isLoading} />
          </div>
          <div className="text-center text-sm mt-4">
            Đã có tài khoản?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
