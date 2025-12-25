import { useAppSelector } from "@/hooks/use-redux";
import { useAuthRestore } from "@/hooks/use-auth-restore";
import { PageLoader } from "./PageLoader";

/**
 * Wrapper component: Chặn render App cho đến khi việc khôi phục phiên đăng nhập hoàn tất.
 *
 * Lợi ích:
 * - Tránh Race Condition: WebSocket chỉ connect khi đã có token
 * - Route Guards không redirect sai (có đầy đủ user info trước khi check role)
 * - UX mượt mà: Không bị nháy từ Login -> Dashboard
 * - Data chuẩn: Luôn fetch user mới nhất (role, status đã được admin update)
 *
 * Security Model:
 * - Access Token: Chỉ lưu trong Redux State (Memory) - an toàn XSS
 * - Refresh Token: Trong HttpOnly Cookie (Browser tự gửi, JS không thể đọc)
 * - User Info: Lưu localStorage để UI không bị giật khi F5
 */
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
