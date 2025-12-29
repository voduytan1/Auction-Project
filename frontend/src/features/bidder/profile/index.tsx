import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  Heart,
  Gavel,
  Trophy,
  TrendingUp,
  User as UserIcon,
  Lock,
  ChevronRight,
  LayoutDashboard,
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
import { cn } from "@/lib/utils";
import { ActiveBidsSection } from "./components/ActiveBidsSection";
import { WatchlistSection } from "./components/WatchlistSection";
import { EditProfileForm } from "./components/EditProfileForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ViewRatingsSection } from "./components/ViewRatingsSection";
import { TransactionListPage } from "@/features/bidder/transactions/components/TransactionListPage";

interface BidderStats {
  diemDanhGia: number;
  soLuotDanhGia: number;
  soSanPhamYeuThich: number;
  soSanPhamDangDau: number;
  soSanPhamDaThang: number;
}

type MenuItem =
  | "overview"
  | "profile"
  | "password"
  | "ratings"
  | "active-bids"
  | "won-auctions"
  | "watchlist";

const menuItems: {
  id: MenuItem;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "overview",
    label: "Tổng quan",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "profile",
    label: "Thông tin cá nhân",
    icon: <UserIcon className="h-5 w-5" />,
  },
  { id: "password", label: "Đổi mật khẩu", icon: <Lock className="h-5 w-5" /> },
  {
    id: "ratings",
    label: "Lịch sử đánh giá",
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: "active-bids",
    label: "Đang đấu giá",
    icon: <Gavel className="h-5 w-5" />,
  },
  {
    id: "won-auctions",
    label: "Đấu giá thắng",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    id: "watchlist",
    label: "Danh sách yêu thích",
    icon: <Heart className="h-5 w-5" />,
  },
];

export function BidderProfileManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState<MenuItem>(
    (searchParams.get("tab") as MenuItem) || "overview"
  );
  const [stats] = useState<BidderStats>({
    diemDanhGia: 4.5,
    soLuotDanhGia: 128,
    soSanPhamYeuThich: 15,
    soSanPhamDangDau: 5,
    soSanPhamDaThang: 23,
  });

  const handleMenuChange = (menuId: MenuItem) => {
    setActiveMenu(menuId);
    setSearchParams({ tab: menuId });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuChange(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                      activeMenu === item.id
                        ? "bg-primary/10 text-primary border-r-4 border-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {activeMenu === item.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ))}

                {/* Nâng cấp Seller Button */}
                <div className="p-4 pt-6">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/bidder/upgrade-request")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Nâng cấp Seller
                  </Button>
                </div>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Overview */}
          {activeMenu === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            {stats.diemDanhGia.toFixed(0)}%
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
              </div>

              {/* Activity Stats */}
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
                                (stats.soSanPhamDangDau +
                                  stats.soSanPhamDaThang)) *
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
                              (stats.soSanPhamDangDau +
                                stats.soSanPhamDaThang)) *
                            100
                          : 0
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Điểm đánh giá</span>
                      <span className="font-medium">
                        {((stats.diemDanhGia / 5) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={(stats.diemDanhGia / 5) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile */}
          {activeMenu === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <EditProfileForm />
              </CardContent>
            </Card>
          )}

          {/* Password */}
          {activeMenu === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Bảo vệ tài khoản của bạn bằng cách thay đổi mật khẩu định kỳ
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>
          )}

          {/* Ratings */}
          {activeMenu === "ratings" && (
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử đánh giá</CardTitle>
                <CardDescription>
                  Xem các đánh giá bạn đã nhận và đã cho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ViewRatingsSection />
              </CardContent>
            </Card>
          )}

          {/* Active Bids */}
          {activeMenu === "active-bids" && (
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đang đấu giá</CardTitle>
                <CardDescription>
                  Danh sách các sản phẩm bạn đang tham gia đấu giá
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActiveBidsSection />
              </CardContent>
            </Card>
          )}

          {/* Won Auctions */}
          {activeMenu === "won-auctions" && (
            <Card>
              <CardHeader>
                <CardTitle>Đấu giá thắng</CardTitle>
                <CardDescription>
                  Xem danh sách các sản phẩm bạn đã thắng đấu giá
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionListPage role="buyer" />
              </CardContent>
            </Card>
          )}

          {/* Watchlist */}
          {activeMenu === "watchlist" && (
            <Card>
              <CardHeader>
                <CardTitle>Danh sách yêu thích</CardTitle>
                <CardDescription>
                  Các sản phẩm bạn đang theo dõi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WatchlistSection />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
