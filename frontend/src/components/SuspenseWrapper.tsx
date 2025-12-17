import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

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
