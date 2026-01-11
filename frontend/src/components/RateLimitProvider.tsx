import { useState, useEffect } from "react";
import { RateLimitModal } from "@/components/RateLimitModal";
import { rateLimitManager } from "@/services/rate-limit";

/**
 * RateLimitProvider
 * Listens to rate limit events and shows modal when rate limited
 */
export function RateLimitProvider({ children }: { children: React.ReactNode }) {
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    // Subscribe to rate limit changes
    const unsubscribe = rateLimitManager.subscribe((limited) => {
      console.log("[RateLimitProvider] Rate limit changed:", limited);
      setIsRateLimited(limited);
    });

    return unsubscribe;
  }, []);

  const handleConfirm = () => {
    rateLimitManager.clear();
  };

  return (
    <>
      {children}
      <RateLimitModal open={isRateLimited} onConfirm={handleConfirm} />
    </>
  );
}
