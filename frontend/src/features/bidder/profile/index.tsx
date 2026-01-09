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
} from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActiveBidsSection } from "./components/ActiveBidsSection";
import { WatchlistSection } from "./components/WatchlistSection";
import { EditProfileForm } from "./components/EditProfileForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ViewRatingsSection } from "./components/ViewRatingsSection";
import { TransactionListPage } from "@/features/bidder/transactions/components/TransactionListPage";

type MenuItem =
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
    (searchParams.get("tab") as MenuItem) || "profile"
  );

  const handleMenuChange = (menuId: MenuItem) => {
    setActiveMenu(menuId);
    setSearchParams({ tab: menuId });
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 lg:w-64 xl:w-72 shrink-0 hidden md:block">
          <Card className="sticky top-4">
            <CardContent className="p-0">
              <nav className="space-y-1 py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuChange(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 md:px-4 lg:px-5 py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-colors rounded-md md:rounded-none",
                      activeMenu === item.id
                        ? "bg-primary/10 text-primary md:border-r-4 border-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="text-sm md:text-base">{item.label}</span>
                    </div>
                    {activeMenu === item.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ))}

                {/* Nâng cấp Seller Button */}
                <div className="p-3 md:p-4 pt-4 md:pt-6">
                  <Button
                    className="w-full text-sm md:text-base"
                    onClick={() => navigate("/bidder/upgrade-request")}
                  >
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Nâng cấp Seller
                  </Button>
                </div>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Profile */}
          {activeMenu === "profile" && (
            <PageWrapper title="Thông tin cá nhân">
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
            </PageWrapper>
          )}

          {/* Password */}
          {activeMenu === "password" && (
            <PageWrapper title="Đổi mật khẩu">
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
            </PageWrapper>
          )}

          {/* Ratings */}
          {activeMenu === "ratings" && (
            <PageWrapper title="Lịch sử đánh giá">
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
            </PageWrapper>
          )}

          {/* Active Bids */}
          {activeMenu === "active-bids" && (
            <PageWrapper title="Sản phẩm đang đấu giá">
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
            </PageWrapper>
          )}

          {/* Won Auctions */}
          {activeMenu === "won-auctions" && (
            <PageWrapper title="Đấu giá thắng">
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
            </PageWrapper>
          )}

          {/* Watchlist */}
          {activeMenu === "watchlist" && (
            <PageWrapper title="Danh sách yêu thích">
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
            </PageWrapper>
          )}
        </main>
      </div>
    </div>
  );
}
