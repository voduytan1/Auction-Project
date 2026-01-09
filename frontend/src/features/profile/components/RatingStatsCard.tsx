import { useState, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageLoader } from "@/components/PageLoader";
import { useAppSelector } from "@/hooks/use-redux";
import { ratingAPI, type RatingResponse } from "@/services/rating.api";
import { toast } from "sonner";
import type { RatingStats } from "../types";

interface RatingStatsCardProps {
  ratingStats: RatingStats | null;
}

export function RatingStatsCard({ ratingStats }: RatingStatsCardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [receivedRatings, setReceivedRatings] = useState<RatingResponse[]>([]);
  const [givenRatings, setGivenRatings] = useState<RatingResponse[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [loadingGiven, setLoadingGiven] = useState(true);

  useEffect(() => {
    const fetchReceivedRatings = async () => {
      if (!user?.userid) return;

      try {
        setLoadingReceived(true);
        const response = await ratingAPI.getRatingsOfUser(user.userid, {
          page: 1,
          size: 20,
        });
        setReceivedRatings(Array.isArray(response.data) ? response.data : []);
      } catch {
        toast.error("Không thể tải đánh giá nhận được");
      } finally {
        setLoadingReceived(false);
      }
    };

    const fetchGivenRatings = async () => {
      try {
        setLoadingGiven(true);
        const response = await ratingAPI.getMyRatings({
          page: 1,
          size: 20,
        });
        setGivenRatings(Array.isArray(response.data) ? response.data : []);
      } catch {
        toast.error("Không thể tải đánh giá đã cho");
      } finally {
        setLoadingGiven(false);
      }
    };

    fetchReceivedRatings();
    fetchGivenRatings();
  }, [user?.userid]);

  const totalReceived = receivedRatings.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderRatingsList = (
    ratings: RatingResponse[],
    isReceived: boolean
  ) => {
    if (ratings.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có đánh giá nào</p>
          <p className="text-sm mt-2">
            {isReceived
              ? "Hoàn thành giao dịch để nhận đánh giá"
              : "Hoàn thành giao dịch để đánh giá người khác"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3 sm:space-y-4">
        {ratings.map((rating) => (
          <Card
            key={rating.ratingid}
            className="border-l-2 sm:border-l-4 border-l-primary/20"
          >
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">
                        {isReceived ? rating.tenRater : rating.tenRatee}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        Sản phẩm: {rating.tenSanPham}
                      </p>
                    </div>
                    <Badge
                      variant={rating.diem > 0 ? "default" : "destructive"}
                      className="text-xs shrink-0"
                    >
                      {rating.diem > 0 ? (
                        <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      ) : (
                        <ThumbsDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      )}
                      <span className="hidden sm:inline">
                        {rating.diem > 0 ? "Tích cực" : "Tiêu cực"}
                      </span>
                      <span className="sm:hidden">
                        {rating.diem > 0 ? "+" : "-"}
                      </span>
                    </Badge>
                  </div>

                  {/* Comment */}
                  {rating.nhanXet && (
                    <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <p className="text-foreground">{rating.nhanXet}</p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(rating.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        {ratingStats ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Summary */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center py-3 sm:py-4">
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  {ratingStats.percentage.toFixed(1)}%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tổng {ratingStats.total} đánh giá
                </p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="font-medium text-sm sm:text-base">
                      Tích cực
                    </span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {ratingStats.positive}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    <span className="font-medium text-sm sm:text-base">
                      Tiêu cực
                    </span>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    {ratingStats.negative}
                  </Badge>
                </div>
              </div>

              {ratingStats.percentage < 80 && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs sm:text-sm">
                    Bạn cần có ít nhất 80% đánh giá tích cực để tham gia đấu giá
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Rating History Tabs */}
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="received"
                  className="text-xs sm:text-sm md:text-base"
                >
                  <span className="hidden xs:inline">Nhận được</span>
                  <span className="xs:hidden">Nhận</span>({totalReceived})
                </TabsTrigger>
                <TabsTrigger
                  value="given"
                  className="text-xs sm:text-sm md:text-base"
                >
                  <span className="hidden xs:inline">Đã cho</span>
                  <span className="xs:hidden">Cho</span>({givenRatings.length})
                </TabsTrigger>
              </TabsList>

              {/* Received Ratings Tab */}
              <TabsContent
                value="received"
                className="space-y-3 sm:space-y-4 mt-3 sm:mt-4"
              >
                {loadingReceived ? (
                  <PageLoader message="Đang tải đánh giá..." />
                ) : (
                  renderRatingsList(receivedRatings, true)
                )}
              </TabsContent>

              {/* Given Ratings Tab */}
              <TabsContent
                value="given"
                className="space-y-3 sm:space-y-4 mt-3 sm:mt-4"
              >
                {loadingGiven ? (
                  <PageLoader message="Đang tải đánh giá..." />
                ) : (
                  renderRatingsList(givenRatings, false)
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <Star className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Chưa có đánh giá</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
