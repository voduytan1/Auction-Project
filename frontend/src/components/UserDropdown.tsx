import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  TrendingUp,
  LayoutDashboard,
  Heart,
  Gavel,
  Trophy,
  Package,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  user: {
    username: string;
    email: string;
    hoVaTen?: string;
    anhDaiDien?: string;
    vaitro: "ADMIN" | "SELLER" | "BIDDER";
  };
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Quản trị viên";
    case "SELLER":
      return "Người bán";
    case "BIDDER":
      return "Người mua";
    default:
      return role;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-500 text-white hover:bg-red-600";
    case "SELLER":
      return "bg-green-500 text-white hover:bg-green-600";
    case "BIDDER":
      return "bg-blue-500 text-white hover:bg-blue-600";
    default:
      return "bg-gray-500 text-white hover:bg-gray-600";
  }
};

export default function UserDropdown({ user }: UserDropdownProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    // Đưa về trang chủ thay vì login - router sẽ tự redirect nếu cần auth
    navigate("/", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 sm:gap-3 h-auto py-1 sm:py-2 px-1 sm:px-2 md:px-3"
        >
          <div className="text-xs sm:text-sm text-right hidden lg:block">
            <p className="font-medium">{user.hoVaTen || user.username}</p>
            <div className="flex items-center gap-1.5 justify-end">
              <Badge
                className={cn(
                  "text-xs px-1.5 py-0",
                  getRoleBadgeColor(user.vaitro)
                )}
              >
                {getRoleLabel(user.vaitro)}
              </Badge>
            </div>
          </div>
          <Avatar className="h-8 sm:h-9 md:h-10 w-8 sm:w-9 md:w-10 ring-2 ring-primary/10">
            <AvatarImage src={user.anhDaiDien} alt={user.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        {/* Common Profile Link */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserIcon className="mr-2 h-4 w-4" />
          Hồ sơ cá nhân
        </DropdownMenuItem>

        {/* Role-specific items */}
        {user.vaitro === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Quản trị
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </>
        )}

        {/* User features - available for both BIDDER and SELLER */}
        {(user.vaitro === "BIDDER" || user.vaitro === "SELLER") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/bidder/watchlist")}>
              <Heart className="mr-2 h-4 w-4" />
              Danh sách yêu thích
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/bidder/active-bids")}>
              <Gavel className="mr-2 h-4 w-4" />
              Đang đấu giá
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/bidder/transactions")}>
              <Trophy className="mr-2 h-4 w-4" />
              Đấu giá thắng
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/seller/products")}>
              <Package className="mr-2 h-4 w-4" />
              Sản phẩm đang bán
            </DropdownMenuItem>
            {user.vaitro === "SELLER" && (
              <DropdownMenuItem
                onClick={() => navigate("/seller/products/create")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Đăng sản phẩm
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate("/seller/transactions")}>
              <DollarSign className="mr-2 h-4 w-4" />
              Sản phẩm đã bán
            </DropdownMenuItem>
            {user.vaitro === "BIDDER" && (
              <DropdownMenuItem
                onClick={() => navigate("/bidder/upgrade-request")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Nâng cấp Seller
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
