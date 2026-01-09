import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { RatingResponse } from "@/services/rating.api";
import { RatingItem } from "./RatingItem";

interface RatingsListProps {
  ratings: RatingResponse[];
  totalRatings: number;
}

export function RatingsList({ ratings, totalRatings }: RatingsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        {totalRatings === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground font-medium mb-2">
              Thành viên mới
            </p>
            <p className="text-sm text-muted-foreground">
              Người dùng này chưa có lịch sử giao dịch
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <RatingItem key={rating.ratingid} rating={rating} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
