import { useNavigate } from "react-router-dom";
import {
  Star,
  Package,
  CheckCircle2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SellerStats {
  diemDanhGia: number;
  soLuotDanhGia: number;
  soSanPhamDangBan: number;
  soSanPhamDaBan: number;
  doanhThu: number;
}

interface SellerOverviewProps {
  stats: SellerStats;
}

export function SellerOverview({ stats }: SellerOverviewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Điểm đánh giá</CardTitle>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.diemDanhGia.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.soLuotDanhGia} lượt đánh giá
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soSanPhamDangBan}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã bán</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soSanPhamDaBan}</div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu ước tính
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.doanhThu.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị đấu giá thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Theo dõi tiến độ bán hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sản phẩm đang bán</span>
              <span className="text-sm text-muted-foreground">
                {stats.soSanPhamDangBan}
              </span>
            </div>
            <Progress value={(stats.soSanPhamDangBan / 20) * 100} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tỷ lệ bán thành công</span>
              <span className="text-sm text-muted-foreground">
                {(
                  (stats.soSanPhamDaBan /
                    (stats.soSanPhamDangBan + stats.soSanPhamDaBan)) *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>
            <Progress
              value={
                (stats.soSanPhamDaBan /
                  (stats.soSanPhamDangBan + stats.soSanPhamDaBan)) *
                100
              }
              className="bg-green-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/seller/products/create")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Đăng sản phẩm mới
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/seller/products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Quản lý sản phẩm
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/seller/profile?tab=sold-products")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Xem giao dịch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
