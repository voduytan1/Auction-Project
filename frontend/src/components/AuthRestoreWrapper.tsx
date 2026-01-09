import { useAppSelector } from "@/hooks/use-redux";
import { useAuthRestore } from "@/hooks/use-auth-restore";
import { PageLoader } from "./PageLoader";


export function AuthRestoreWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Trigger restore logic
  useAuthRestore();

  // Get the initializing flag từ Redux
  const isInitializing = useAppSelector((state) => state.auth.isInitializing);

  // Nếu đang khôi phục phiên, hiển thị màn hình loading
  if (isInitializing) {
    return (
      <PageLoader
        message="Đang khôi phục phiên đăng nhập..."
        className="min-h-screen"
      />
    );
  }

  // Restore xong (hoặc là khách), hiển thị App
  return <>{children}</>;
}
