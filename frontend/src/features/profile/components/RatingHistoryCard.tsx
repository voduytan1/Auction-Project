import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserRating } from "../types";

interface RatingHistoryCardProps {
  ratings: UserRating[];
}

export function RatingHistoryCard({ ratings }: RatingHistoryCardProps) {
  if (ratings.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar>
                <AvatarImage src={rating.fromUser.avatar} />
                <AvatarFallback>
                  {rating.fromUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {rating.fromUser.username}
                  </span>
                  {rating.type === "like" ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                {rating.comment && (
                  <p className="text-sm text-muted-foreground">
                    {rating.comment}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
