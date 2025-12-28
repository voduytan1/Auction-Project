import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gavel, Clock, ArrowRight, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";
import { formatCurrency, formatTimeRemaining } from "@/lib/format";

interface ActiveBid {
  productId: number;
  tenSanPham: string;
  anhSanPham: string;
  giaHienTai: number;
  giaCuaToi: number;
  thoiGianKetThuc: string;
  dangDanDau: boolean;
  soLuotDauGia: number;
}

export default function ActiveBidsPage() {
  const [activeBids, setActiveBids] = useState<ActiveBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch từ API GET /bids/my-active
    const fetchActiveBids = async () => {
      try {
        // Mock data for now
        setActiveBids([
          {
            productId: 1,
            tenSanPham: "iPhone 15 Pro Max 256GB",
            anhSanPham: "https://placehold.co/200x200",
            giaHienTai: 28000000,
            giaCuaToi: 27500000,
            thoiGianKetThuc: new Date(Date.now() + 3600000).toISOString(),
            dangDanDau: false,
            soLuotDauGia: 15,
          },
          {
            productId: 2,
            tenSanPham: "MacBook Pro M3 16GB",
            anhSanPham: "https://placehold.co/200x200",
            giaHienTai: 45000000,
            giaCuaToi: 45000000,
            thoiGianKetThuc: new Date(Date.now() + 7200000).toISOString(),
            dangDanDau: true,
            soLuotDauGia: 8,
          },
        ]);
      } catch (error) {
        console.error("Error fetching active bids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBids();
  }, []);

  if (isLoading) {
    return <PageLoader message="Đang tải sản phẩm đang đấu giá..." />;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Sản phẩm đang đấu giá
        </h1>
        <p className="text-muted-foreground">
          {activeBids.length} sản phẩm bạn đang tham gia đấu giá
        </p>
      </div>

      {activeBids.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">
                Bạn chưa tham gia đấu giá sản phẩm nào
              </p>
              <p className="text-sm mt-2">
                Khám phá các sản phẩm đấu giá hấp dẫn
              </p>
              <Button className="mt-4" asChild>
                <Link to="/">Khám phá sản phẩm</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeBids.map((bid) => (
            <Card key={bid.productId} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                  <img
                    src={bid.anhSanPham}
                    alt={bid.tenSanPham}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {bid.tenSanPham}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Gavel className="h-4 w-4" />
                        <span>{bid.soLuotDauGia} lượt đấu giá</span>
                      </div>
                    </div>
                    <Badge
                      variant={bid.dangDanDau ? "default" : "secondary"}
                      className={
                        bid.dangDanDau
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-orange-500 hover:bg-orange-600"
                      }
                    >
                      {bid.dangDanDau ? (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Đang dẫn đầu
                        </>
                      ) : (
                        "Bị vượt qua"
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Giá hiện tại
                      </p>
                      <p className="font-bold text-lg text-primary">
                        {formatCurrency(bid.giaHienTai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Giá của bạn
                      </p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(bid.giaCuaToi)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Còn {formatTimeRemaining(bid.thoiGianKetThuc)}
                      </span>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/product/${bid.productId}`}>
                        Xem chi tiết
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
