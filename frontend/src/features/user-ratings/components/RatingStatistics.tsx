import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface RatingStatisticsProps {
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
}

export function RatingStatistics({
  averageRating,
  positiveCount,
  negativeCount,
}: RatingStatisticsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Thống kê đánh giá
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Rating Percentage */}
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="text-4xl sm:text-5xl font-bold text-yellow-600 mb-2">
              {averageRating.toFixed(0)}%
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Tỷ lệ uy tín
            </div>
          </div>

          {/* Positive Ratings */}
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="h-6 w-6 text-green-600" />
              <div className="text-4xl sm:text-5xl font-bold text-green-600">
                {positiveCount}
              </div>
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Đánh giá tích cực
            </div>
          </div>

          {/* Negative Ratings */}
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsDown className="h-6 w-6 text-red-600" />
              <div className="text-4xl sm:text-5xl font-bold text-red-600">
                {negativeCount}
              </div>
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Đánh giá tiêu cực
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
