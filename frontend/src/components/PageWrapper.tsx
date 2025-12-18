import { useEffect } from "react";

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
