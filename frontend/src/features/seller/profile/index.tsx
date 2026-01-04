import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Star,
  Package,
  CheckCircle2,
  User as UserIcon,
  Lock,
  ChevronRight,
} from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Import components
import { ChangePasswordForm } from "@/features/bidder/profile/components/ChangePasswordForm";
import { EditProfileForm } from "@/features/bidder/profile/components/EditProfileForm";
import { ViewRatingsSection } from "@/features/bidder/profile/components/ViewRatingsSection";
import { ActiveProductsList } from "./components/ActiveProductsList";
import { TransactionListPage } from "@/features/bidder/transactions/components/TransactionListPage";

type MenuItem =
  | "profile"
  | "password"
  | "ratings"
  | "active-products"
  | "sold-products";

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
    label: "Đánh giá nhận được",
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: "active-products",
    label: "Sản phẩm đang bán",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "sold-products",
    label: "Sản phẩm đã bán",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
];

export default function SellerProfileManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState<MenuItem>(
    (searchParams.get("tab") as MenuItem) || "profile"
  );

  const handleMenuChange = (menuId: MenuItem) => {
    setActiveMenu(menuId);
    setSearchParams({ tab: menuId });
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return (
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
        );

      case "password":
        return (
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
        );

      case "ratings":
        return (
          <PageWrapper title="Đánh giá nhận được">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá nhận được</CardTitle>
                <CardDescription>Xem các đánh giá từ người mua</CardDescription>
              </CardHeader>
              <CardContent>
                <ViewRatingsSection />
              </CardContent>
            </Card>
          </PageWrapper>
        );

      case "active-products":
        return (
          <PageWrapper title="Sản phẩm đang bán">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đang bán</CardTitle>
                <CardDescription>
                  Xem danh sách các sản phẩm bạn đang rao bán
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.userid ? (
                  <ActiveProductsList sellerId={user.userid} />
                ) : null}
              </CardContent>
            </Card>
          </PageWrapper>
        );

      case "sold-products":
        return (
          <PageWrapper title="Sản phẩm đã bán">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã bán</CardTitle>
                <CardDescription>
                  Xem danh sách các sản phẩm bạn đã bán thành công
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionListPage role="seller" />
              </CardContent>
            </Card>
          </PageWrapper>
        );

      default:
        return null;
    }
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
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{renderContent()}</main>
      </div>
    </div>
  );
}
