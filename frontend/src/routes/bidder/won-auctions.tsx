import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";
import { formatCurrency } from "@/lib/format";

interface WonAuction {
  productId: number;
  tenSanPham: string;
  anhSanPham: string;
  giaThang: number;
  ngayThang: string;
  trangThaiGiaoDich: "PENDING" | "PAID" | "SHIPPING" | "COMPLETED";
  transactionId?: number;
}

const statusLabels: Record<WonAuction["trangThaiGiaoDich"], string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Hoàn thành",
};

const statusColors: Record<WonAuction["trangThaiGiaoDich"], string> = {
  PENDING: "bg-yellow-500",
  PAID: "bg-blue-500",
  SHIPPING: "bg-purple-500",
  COMPLETED: "bg-green-500",
};

export default function WonAuctionsPage() {
  const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch từ API GET /bids/my-won hoặc GET /transactions?role=buyer&status=won
    const fetchWonAuctions = async () => {
      try {
        // Mock data for now
        setWonAuctions([
          {
            productId: 1,
            tenSanPham: "Đồng hồ Rolex Submariner",
            anhSanPham: "https://placehold.co/200x200",
            giaThang: 150000000,
            ngayThang: "2024-12-25T10:30:00",
            trangThaiGiaoDich: "COMPLETED",
            transactionId: 101,
          },
          {
            productId: 2,
            tenSanPham: "Túi Louis Vuitton Neverfull",
            anhSanPham: "https://placehold.co/200x200",
            giaThang: 45000000,
            ngayThang: "2024-12-20T15:45:00",
            trangThaiGiaoDich: "SHIPPING",
            transactionId: 102,
          },
          {
            productId: 3,
            tenSanPham: "Giày Nike Air Jordan 1 Retro",
            anhSanPham: "https://placehold.co/200x200",
            giaThang: 8500000,
            ngayThang: "2024-12-18T09:20:00",
            trangThaiGiaoDich: "PENDING",
            transactionId: 103,
          },
        ]);
      } catch (error) {
        console.error("Error fetching won auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWonAuctions();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <PageLoader message="Đang tải sản phẩm đã thắng..." />;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Sản phẩm đã thắng
        </h1>
        <p className="text-muted-foreground">
          {wonAuctions.length} sản phẩm bạn đã thắng đấu giá
        </p>
      </div>

      {wonAuctions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">
                Bạn chưa thắng đấu giá sản phẩm nào
              </p>
              <p className="text-sm mt-2">
                Tham gia đấu giá để có cơ hội sở hữu sản phẩm yêu thích
              </p>
              <Button className="mt-4" asChild>
                <Link to="/">Khám phá sản phẩm</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {wonAuctions.map((auction) => (
            <Card key={auction.productId} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 relative">
                  <img
                    src={auction.anhSanPham}
                    alt={auction.tenSanPham}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Trophy className="h-3 w-3 mr-1" />
                      Thắng
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {auction.tenSanPham}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Thắng ngày {formatDate(auction.ngayThang)}</span>
                      </div>
                    </div>
                    <Badge
                      className={statusColors[auction.trangThaiGiaoDich]}
                    >
                      {auction.trangThaiGiaoDich === "COMPLETED" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {statusLabels[auction.trangThaiGiaoDich]}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">Giá thắng</p>
                    <p className="font-bold text-2xl text-primary">
                      {formatCurrency(auction.giaThang)}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4">
                    {auction.transactionId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/transaction/${auction.transactionId}`}>
                          Xem giao dịch
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link to={`/product/${auction.productId}`}>
                        Xem sản phẩm
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
