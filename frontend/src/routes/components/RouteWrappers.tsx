import { Suspense, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * SEO Wrapper - Set document title cho mỗi route
 */
export function PageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} | AuctionHub`;
    // Có thể thêm meta tags khác ở đây
  }, [title]);

  return <>{children}</>;
}

/**
 * Suspense Wrapper với loading spinner
 */
export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
