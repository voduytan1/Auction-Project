import { Outlet } from "react-router-dom";

/**
 * AuthLayout - For authentication pages
 * Pages: Login, Register, Forgot Password, Reset Password
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
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
  );
};

export default AuthLayout;
