import { useState } from "react";
import { History, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BidHistoryItem {
  id: string;
  nguoiDauGia: {
    userid: string;
    username: string;
  };
  giaRa: number;
  thoiGian: string;
  isCurrentUserBid: boolean;
}

interface BidHistoryProps {
  productId: string;
  currentUserId?: string;
}

export function BidHistory({
  productId: _productId,
  currentUserId,
}: BidHistoryProps) {
  // Mock data for bid history
  const mockBidHistory: BidHistoryItem[] = [
    {
      id: "1",
      nguoiDauGia: {
        userid: "user-001",
        username: "buyer2024",
      },
      giaRa: 28500000,
      thoiGian: "2024-12-23T14:30:00",
      isCurrentUserBid: false,
    },
    {
      id: "2",
      nguoiDauGia: {
        userid: currentUserId || "current-user",
        username: "myusername",
      },
      giaRa: 28000000,
      thoiGian: "2024-12-23T13:45:00",
      isCurrentUserBid: true,
    },
    {
      id: "3",
      nguoiDauGia: {
        userid: "user-002",
        username: "auctionlover",
      },
      giaRa: 27500000,
      thoiGian: "2024-12-23T12:20:00",
      isCurrentUserBid: false,
    },
    {
      id: "4",
      nguoiDauGia: {
        userid: "user-003",
        username: "techfan88",
      },
      giaRa: 27000000,
      thoiGian: "2024-12-23T11:10:00",
      isCurrentUserBid: false,
    },
    {
      id: "5",
      nguoiDauGia: {
        userid: "user-004",
        username: "shopping123",
      },
      giaRa: 26500000,
      thoiGian: "2024-12-23T10:00:00",
      isCurrentUserBid: false,
    },
  ];

  const [bidHistory] = useState<BidHistoryItem[]>(mockBidHistory);

  // TODO: Fetch bid history from API
  // useEffect(() => {
  //   const fetchBidHistory = async () => {
  //     const data = await bidApi.getBidHistory(productId);
  //     setBidHistory(data);
  //   };
  //   fetchBidHistory();
  // }, [productId]);

  const maskUsername = (username: string, userid: string) => {
    // Don't mask if it's current user's bid
    if (currentUserId && userid === currentUserId) {
      return username;
    }

    // Mask username: show first 2 chars and last 2 chars with *** in between
    if (username.length <= 4) {
      return username[0] + "***";
    }

    const firstTwo = username.substring(0, 2);
    const lastTwo = username.substring(username.length - 2);
    return `${firstTwo}***${lastTwo}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (bidHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử đấu giá
          </CardTitle>
          <CardDescription>
            Lịch sử các lần đặt giá cho sản phẩm này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có lượt đấu giá nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử đấu giá
        </CardTitle>
        <CardDescription>
          {bidHistory.length} lượt đặt giá - Người dùng được ẩn danh
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead>Người đấu giá</TableHead>
                <TableHead className="text-right">Giá đặt</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidHistory.map((bid, index) => (
                <TableRow
                  key={bid.id}
                  className={bid.isCurrentUserBid ? "bg-primary/5" : undefined}
                >
                  <TableCell className="font-medium">
                    {bidHistory.length - index}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {maskUsername(
                          bid.nguoiDauGia.username,
                          bid.nguoiDauGia.userid
                        )}
                      </span>
                      {bid.isCurrentUserBid && (
                        <Badge variant="secondary" className="text-xs">
                          Bạn
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">
                          Giá cao nhất
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatPrice(bid.giaRa)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDateTime(bid.thoiGian)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
