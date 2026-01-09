import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ratingAPI, type RatingResponse } from "@/services/rating.api";
import { userAPI } from "@/services/user.api";
import type { User } from "@/features/auth/types";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { RatingStatistics } from "./components/RatingStatistics";
import { RatingsList } from "./components/RatingsList";

export default function UserRatingsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // Fetch user info and ratings in parallel
        const [userResponse, ratingsResponse] = await Promise.all([
          userAPI.getById(userId),
          ratingAPI.getRatingsOfUser(userId, {
            page: 1,
            size: 100,
          }),
        ]);

        // Set user info
        setUser(userResponse.data);

        // Process ratings
        const response = ratingsResponse;

        // Response interceptor đã extract data, metadata ở __raw__
        const ratingsData = Array.isArray(response.data) ? response.data : [];
        const metadata = (response as any).__raw__?.metadata;

        setRatings(ratingsData);
        setTotalRatings(metadata?.totalElements ?? ratingsData.length);

        // Calculate statistics
        const positive = ratingsData.filter((r) => r.diem > 0).length;
        const negative = ratingsData.filter((r) => r.diem < 0).length;
        setPositiveCount(positive);
        setNegativeCount(negative);

        if (ratingsData.length > 0) {
          setAverageRating((positive / ratingsData.length) * 100);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Không thể tải danh sách đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <Button onClick={() => navigate(-1)} className="mt-4">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <UserProfileHeader
        user={user}
        averageRating={averageRating}
        totalRatings={totalRatings}
      />

      <RatingStatistics
        averageRating={averageRating}
        positiveCount={positiveCount}
        negativeCount={negativeCount}
      />

      <RatingsList ratings={ratings} totalRatings={totalRatings} />
    </div>
  );
}
