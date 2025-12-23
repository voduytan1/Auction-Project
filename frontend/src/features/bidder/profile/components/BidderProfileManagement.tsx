import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Gavel,
  Trophy,
  TrendingUp,
  User as UserIcon,
  Lock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EditProfileForm } from "./EditProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ViewRatingsSection } from "./ViewRatingsSection";

interface BidderStats {
  diemDanhGia: number;
  soLuotDanhGia: number;
  soSanPhamYeuThich: number;
  soSanPhamDangDau: number;
  soSanPhamDaThang: number;
}

export function BidderProfileManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats] = useState<BidderStats>({
    diemDanhGia: 4.5,
    soLuotDanhGia: 128,
    soSanPhamYeuThich: 15,
    soSanPhamDangDau: 5,
    soSanPhamDaThang: 23,
  });

  // TODO: Fetch stats from API

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và hoạt động đấu giá của bạn
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đánh giá
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {stats.diemDanhGia}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({stats.soLuotDanhGia})
                  </span>
                </div>
              </div>
              <Star className="h-8 w-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Yêu thích
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.soSanPhamYeuThich}
                </p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đang đấu
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.soSanPhamDangDau}
                </p>
              </div>
              <Gavel className="h-8 w-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã thắng
                </p>
                <p className="text-2xl font-bold mt-1">
                  {stats.soSanPhamDaThang}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button
              className="w-full h-full"
              variant="outline"
              onClick={() => navigate("/bidder/upgrade-request")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Nâng cấp Seller
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="profile">
            <UserIcon className="h-4 w-4 mr-2" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            Mật khẩu
          </TabsTrigger>
          <TabsTrigger value="ratings">Đánh giá</TabsTrigger>
          <TabsTrigger value="watchlist">Yêu thích</TabsTrigger>
          <TabsTrigger value="bidding">Đang đấu</TabsTrigger>
          <TabsTrigger value="won">Đã thắng</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê hoạt động</CardTitle>
              <CardDescription>
                Tổng quan về các hoạt động đấu giá của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tỷ lệ thắng đấu giá</span>
                  <span className="font-medium">
                    {stats.soSanPhamDaThang > 0
                      ? Math.round(
                          (stats.soSanPhamDaThang /
                            (stats.soSanPhamDangDau + stats.soSanPhamDaThang)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    stats.soSanPhamDaThang > 0
                      ? (stats.soSanPhamDaThang /
                          (stats.soSanPhamDangDau + stats.soSanPhamDaThang)) *
                        100
                      : 0
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("watchlist")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Xem danh sách yêu thích
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("bidding")}
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Xem sản phẩm đang đấu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <EditProfileForm />
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <ViewRatingsSection />
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu thích</CardTitle>
              <CardDescription>
                {stats.soSanPhamYeuThich} sản phẩm đang theo dõi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Danh sách yêu thích sẽ hiển thị ở đây</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/bidder/watchlist")}
                >
                  Xem danh sách yêu thích
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bidding Tab */}
        <TabsContent value="bidding">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đang đấu giá</CardTitle>
              <CardDescription>
                {stats.soSanPhamDangDau} sản phẩm đang tham gia đấu giá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa tham gia đấu giá sản phẩm nào</p>
                <Button className="mt-4" onClick={() => navigate("/products")}>
                  Khám phá sản phẩm
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Won Tab */}
        <TabsContent value="won">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã thắng</CardTitle>
              <CardDescription>
                {stats.soSanPhamDaThang} sản phẩm đã thắng đấu giá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa thắng đấu giá sản phẩm nào</p>
                <p className="text-sm mt-2">
                  Tham gia đấu giá để có cơ hội sở hữu sản phẩm yêu thích
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
