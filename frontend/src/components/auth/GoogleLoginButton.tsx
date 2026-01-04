import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { loginWithGoogle } from "@/store/slices/authSlice";

interface GoogleLoginButtonProps {
  disabled?: boolean;
  onLoginSuccess?: () => void;
}

/**
 * Google Login Button - Dùng GoogleLogin component để lấy ID token
 * 1. User click → Google popup
 * 2. Google trả credential (ID token)
 * 3. Dispatch loginWithGoogle thunk với ID token
 * 4. Backend verify ID token với GoogleIdTokenVerifier
 * 5. Thunk tự động update Redux state
 * 6. Parent component (LoginForm) tự navigate
 */
export function GoogleLoginButton({
  disabled,
  onLoginSuccess,
}: GoogleLoginButtonProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      className={`w-full ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log("Google credential received");

          if (!credentialResponse.credential) {
            toast.error("Không nhận được thông tin từ Google");
            return;
          }

          // Dispatch thunk với ID token (credential)
          // Backend sẽ verify ID token này với GoogleIdTokenVerifier
          const result = await dispatch(
            loginWithGoogle(credentialResponse.credential)
          );

          // Check if login was successful
          if (result.type === "auth/loginWithGoogle/fulfilled") {
            console.log("Google login successful");
            onLoginSuccess?.();
          }
        }}
        onError={() => {
          toast.error("Đăng nhập Google thất bại");
        }}
        theme="outline"
        size="large"
        text="signin_with"
      />
    </div>
  );
}
