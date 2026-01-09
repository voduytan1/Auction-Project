import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ratingAPI, type RatingResponse } from "@/services/rating.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { Star, ArrowLeft, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserRatingsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await ratingAPI.getRatingsOfUser(userId, {
          page: 1,
          size: 100, // Get all ratings
        });

        const ratingsData = Array.isArray(response.data) ? response.data : [];

        setRatings(ratingsData);
        setTotalRatings(ratingsData.length);

        // Calculate average
        if (ratingsData.length > 0) {
          const total = ratingsData.reduce(
            (sum, r) => sum + (r.isPositive ? 1 : 0),
            0
          );
          setAverageRating((total / ratingsData.length) * 100);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Không thể tải danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button asChild className="mt-4">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Đánh giá người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {averageRating.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Tỷ lệ đánh giá tích cực
              </div>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-700">
                {totalRatings}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Tổng số đánh giá
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {ratings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Người dùng này chưa có đánh giá nào
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <Card key={rating.ratingid}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rating.fromUserAvatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">
                          {rating.fromUserName || "Người dùng"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(
                            new Date(rating.createdAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          rating.isPositive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            rating.isPositive ? "fill-current" : ""
                          }`}
                        />
                        {rating.isPositive ? "Tích cực" : "Tiêu cực"}
                      </div>
                    </div>

                    {rating.comment && (
                      <p className="text-slate-700 whitespace-pre-wrap break-words">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
