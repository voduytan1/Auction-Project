import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
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
import { useEffect, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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

  // Handle reCAPTCHA verification and form submission
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA chưa sẵn sàng. Vui lòng thử lại!");
        return;
      }

      try {
        // Get reCAPTCHA token
        const captchaToken = await executeRecaptcha("register");

        // Submit with captcha token
        const result = await dispatch(registerUser({ ...data, captchaToken }));

        if (registerUser.fulfilled.match(result)) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        toast.error("Xác thực reCAPTCHA thất bại. Vui lòng thử lại!");
      }
    },
    [executeRecaptcha, dispatch, navigate]
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
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
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // TODO: Implement Google OAuth
                console.log("Google register");
              }}
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // TODO: Implement Facebook OAuth
                console.log("Facebook register");
              }}
              disabled={isLoading}
            >
              <FaFacebook className="mr-2 h-5 w-5 text-[#1877F2]" />
              Facebook
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // TODO: Implement GitHub OAuth
                console.log("GitHub register");
              }}
              disabled={isLoading}
            >
              <FaGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // TODO: Implement Twitter OAuth
                console.log("Twitter register");
              }}
              disabled={isLoading}
            >
              <FaXTwitter className="mr-2 h-5 w-5" />
              Twitter
            </Button>
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
