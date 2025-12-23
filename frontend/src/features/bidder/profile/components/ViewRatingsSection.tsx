import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Rating {
  id: string;
  ratingType: "POSITIVE" | "NEGATIVE";
  comment: string;
  raterName: string;
  raterAvatar?: string;
  productName: string;
  createdAt: string;
}

// Mock data for demo
const mockRatings: Rating[] = [
  {
    id: "1",
    ratingType: "POSITIVE",
    comment: "Người mua rất uy tín, thanh toán nhanh chóng. Rất hài lòng!",
    raterName: "Nguyễn Văn A",
    raterAvatar: "",
    productName: "iPhone 15 Pro Max 256GB",
    createdAt: "2024-12-20T10:30:00",
  },
  {
    id: "2",
    ratingType: "POSITIVE",
    comment: "Giao dịch suôn sẻ, người mua nhiệt tình. Recommend!",
    raterName: "Trần Thị B",
    raterAvatar: "",
    productName: "MacBook Pro M3 16GB",
    createdAt: "2024-12-18T15:45:00",
  },
  {
    id: "3",
    ratingType: "NEGATIVE",
    comment: "Thanh toán chậm, cần liên lạc nhiều lần.",
    raterName: "Lê Văn C",
    raterAvatar: "",
    productName: "Samsung Galaxy S24 Ultra",
    createdAt: "2024-12-15T09:20:00",
  },
];

export function ViewRatingsSection() {
  const positiveRatings = mockRatings.filter(
    (r) => r.ratingType === "POSITIVE"
  );
  const negativeRatings = mockRatings.filter(
    (r) => r.ratingType === "NEGATIVE"
  );
  const totalRatings = mockRatings.length;
  const positivePercentage =
    totalRatings > 0
      ? Math.round((positiveRatings.length / totalRatings) * 100)
      : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          Chi tiết đánh giá
        </CardTitle>
        <CardDescription>
          Tất cả đánh giá bạn nhận được từ người bán
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng đánh giá</p>
              <p className="text-3xl font-bold">{totalRatings}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tỷ lệ tích cực</p>
              <p className="text-3xl font-bold text-green-600">
                {positivePercentage}%
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span>Tích cực: {positiveRatings.length}</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <ThumbsDown className="h-4 w-4" />
              <span>Tiêu cực: {negativeRatings.length}</span>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        {mockRatings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có đánh giá nào</p>
            <p className="text-sm mt-2">
              Hoàn thành giao dịch để nhận đánh giá từ người bán
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockRatings.map((rating) => (
              <Card key={rating.id} className="border-l-4 border-l-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={rating.raterAvatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{rating.raterName}</p>
                          <p className="text-sm text-muted-foreground">
                            Sản phẩm: {rating.productName}
                          </p>
                        </div>
                        <Badge
                          variant={
                            rating.ratingType === "POSITIVE"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {rating.ratingType === "POSITIVE" ? (
                            <ThumbsUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ThumbsDown className="h-3 w-3 mr-1" />
                          )}
                          {rating.ratingType === "POSITIVE"
                            ? "Tích cực"
                            : "Tiêu cực"}
                        </Badge>
                      </div>

                      {/* Comment */}
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <p className="text-foreground">{rating.comment}</p>
                      </div>

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
        )}
      </CardContent>
    </Card>
  );
}
