import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { RatingResponse } from "@/services/rating.api";

// Utility: Mask tên người dùng
const maskUserName = (fullName: string): string => {
  if (!fullName || fullName.length <= 3) return "****";
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    // Single word: "Khoa" -> "K***"
    return fullName[0] + "***";
  }
  // Multiple words: "Nguyen Van A" -> "Ng*** A"
  const lastName = parts[parts.length - 1];
  const firstName = parts[0];
  return firstName.substring(0, 2) + "*** " + lastName;
};

interface RatingItemProps {
  rating: RatingResponse;
}

export function RatingItem({ rating }: RatingItemProps) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-slate-100">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {maskUserName(rating.tenRater || "Người dùng")}
                </div>
                <div className="text-xs text-muted-foreground">
                  Sản phẩm:{" "}
                  <Link
                    to={`/products/${rating.productid}`}
                    className="hover:text-primary hover:underline"
                  >
                    {rating.tenSanPham}
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(rating.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shrink-0 ${
                  rating.diem > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rating.diem > 0 ? (
                  <ThumbsUp className="h-4 w-4" />
                ) : (
                  <ThumbsDown className="h-4 w-4" />
                )}
                <span className="font-bold">
                  {rating.diem > 0 ? "+1" : "-1"}
                </span>
              </div>
            </div>

            {rating.nhanXet && (
              <p className="text-sm text-slate-700 whitespace-pre-wrap wrap-break-word bg-slate-50 p-3 rounded-lg">
                "{rating.nhanXet}"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
