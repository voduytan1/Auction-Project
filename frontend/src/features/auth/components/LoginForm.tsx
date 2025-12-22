import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginUser, clearError } from "@/store/slices/authSlice";
import { loginSchema, type LoginFormData } from "../schemas/validation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [isLoginAttempted, setIsLoginAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect chỉ sau khi login thành công (không redirect khi mount với token cũ)
  useEffect(() => {
    if (isAuthenticated && isLoginAttempted) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoginAttempted, navigate]);

  // Clear error khi unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted - no reload should happen", data);

    try {
      setIsLoginAttempted(true);
      const result = await dispatch(loginUser(data));
      console.log("Login result:", result);

      // Check if login was successful
      if (result.type === "auth/login/fulfilled") {
        console.log("Login successful, redirecting...");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <PageLoader message="Đang đăng nhập..." className="py-0" />
        </div>
      )}
      <CardHeader>
        <CardTitle>Đăng Nhập</CardTitle>
        <CardDescription>
          Nhập thông tin đăng nhập để truy cập tài khoản
        </CardDescription>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
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
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc đăng nhập với
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
                console.log("Google login");
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
                console.log("Facebook login");
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
                console.log("GitHub login");
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
                console.log("Twitter login");
              }}
              disabled={isLoading}
            >
              <FaXTwitter className="mr-2 h-5 w-5" />
              Twitter
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            Chưa có tài khoản?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
