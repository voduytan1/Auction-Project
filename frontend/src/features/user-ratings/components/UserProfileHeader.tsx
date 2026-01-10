import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Calendar, ShieldCheck } from "lucide-react";
import type { User } from "@/features/auth/types";

interface UserProfileHeaderProps {
  user: User | null;
  averageRating: number;
  totalRatings: number;
}

export function UserProfileHeader({
  user,
  averageRating,
  totalRatings,
}: UserProfileHeaderProps) {
  const userName = user?.hoVaTen || user?.username || "Người dùng";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            {user?.anhDaiDien && (
              <AvatarImage src={user.anhDaiDien} alt={userName} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              <UserIcon className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{userName}</h1>
            {user?.username && (
              <p className="text-muted-foreground mb-2">@{user.username}</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Tham gia: {joinDate}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {/* Role Badge */}
              {user?.vaitro === "BIDDER" && (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Người mua
                </Badge>
              )}
              {user?.vaitro === "SELLER" && (
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  Người bán
                </Badge>
              )}
              {user?.vaitro === "ADMIN" && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  Quản trị viên
                </Badge>
              )}

              {/* Trust Badge - Only for BIDDER with >= 80% rating */}
              {user?.vaitro === "BIDDER" && averageRating >= 80 && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Người mua uy tín
                </Badge>
              )}

              {/* Active Member Badge */}
              {totalRatings >= 10 && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                  Thành viên tích cực
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
