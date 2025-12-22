import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { RatingStats } from "../types";

interface RatingStatsCardProps {
  ratingStats: RatingStats | null;
}

export function RatingStatsCard({ ratingStats }: RatingStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        {ratingStats ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">
                {ratingStats.percentage.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Tổng {ratingStats.total} đánh giá
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Tích cực</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {ratingStats.positive}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Tiêu cực</span>
                </div>
                <Badge variant="outline" className="text-red-600">
                  {ratingStats.negative}
                </Badge>
              </div>
            </div>

            {ratingStats.percentage < 80 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Bạn cần có ít nhất 80% đánh giá tích cực để tham gia đấu giá
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có đánh giá</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
