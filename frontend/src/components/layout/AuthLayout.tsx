import { Outlet } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "@/config/env";

/**
 * AuthLayout - For authentication pages
 * Pages: Login, Register, Forgot Password, Reset Password
 * Includes reCAPTCHA v3 protection for auth routes only
 */
const AuthLayout = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={env.RECAPTCHA_SITE_KEY}
      language="vi"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted">
        <div className="w-full max-w-md p-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Auction Platform</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to our auction platform
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default AuthLayout;
