import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { loginWithGoogle } from "@/store/slices/authSlice";

interface GoogleLoginButtonProps {
  disabled?: boolean;
  onLoginSuccess?: () => void;
}

/**
 * Google Login Button - Logic giống LoginForm
 * 1. User click → Google popup
 * 2. Google trả access_token
 * 3. Dispatch loginWithGoogle thunk
 * 4. Thunk tự động update Redux state
 * 5. Parent component (LoginForm) tự navigate
 */
export function GoogleLoginButton({ disabled, onLoginSuccess }: GoogleLoginButtonProps) {
  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google token received:", tokenResponse);

      // Dispatch thunk - giống như loginUser
      const result = await dispatch(
        loginWithGoogle(tokenResponse.access_token)
      );

      // Check if login was successful - giống LoginForm
      if (result.type === "auth/loginWithGoogle/fulfilled") {
        console.log("Google login successful");
        onLoginSuccess?.();
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại");
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => login()}
      disabled={disabled}
      className="w-full"
    >
      <FcGoogle className="mr-2 h-5 w-5" />
        Đăng nhập với Google
    </Button>
  );
}
