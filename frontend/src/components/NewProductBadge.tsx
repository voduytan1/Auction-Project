import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface NewProductBadgeProps {
  isHighlight?: boolean;
}

/**
 * Badge to highlight products marked by backend
 * @param isHighlight - Backend highlight flag
 */
export function NewProductBadge({ isHighlight }: NewProductBadgeProps) {
  if (!isHighlight) {
    return null;
  }

  return (
    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
      <Sparkles className="h-3 w-3 mr-1" />
      MỚI
    </Badge>
  );
}
