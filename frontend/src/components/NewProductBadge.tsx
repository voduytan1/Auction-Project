import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { isNewProduct } from "@/lib/product-utils";

interface NewProductBadgeProps {
  createdAt: string | Date;
  minutesThreshold?: number;
}

/**
 * Badge to highlight new products (created within N minutes)
 * @param createdAt - Product creation timestamp
 * @param minutesThreshold - Minutes threshold (default: 60)
 */
export function NewProductBadge({
  createdAt,
  minutesThreshold = 60,
}: NewProductBadgeProps) {
  if (!isNewProduct(createdAt, minutesThreshold)) {
    return null;
  }

  return (
    <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
      <Sparkles className="h-3 w-3 mr-1" />
      MỚI
    </Badge>
  );
}
