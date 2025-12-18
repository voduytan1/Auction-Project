import { Spinner } from "@/components/ui/spinner";

interface PageLoaderProps {
  message?: string;
  className?: string;
}

/**
 * Page loader với spinner và message
 * Sử dụng màu từ CSS variables (--primary)
 */
export function PageLoader({
  message = "Đang tải...",
  className = "py-12",
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
