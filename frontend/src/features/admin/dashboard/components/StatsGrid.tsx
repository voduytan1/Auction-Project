import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gavel, TrendingUp, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/admin.api";
import type { DashboardStats } from "../types";

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getWebStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2" />
              <div className="h-3 bg-muted rounded w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const statCards = [
    {
      title: "TỔNG SỐ NGƯỜI DÙNG",
      value: formatNumber(stats.usersCount),
      change: `${stats.userGrowth > 0 ? "+" : ""}${stats.userGrowth}%`,
      icon: Users,
      subtitle: "so với tháng trước",
      changeColor: stats.userGrowth >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      title: "SỐ ĐẤU GIÁ ĐANG DIỄN RA",
      value: formatNumber(stats.auctionsCount),
      change: `+${formatNumber(stats.newAuctionsCount)}`,
      icon: Gavel,
      subtitle: "mới hôm nay",
      changeColor: "text-green-600",
    },
    {
      title: "TỔNG LƯỢT ĐẤU GIÁ",
      value: formatNumber(stats.bidsCount),
      change: `+${formatNumber(stats.newBidsCount)}`,
      icon: TrendingUp,
      subtitle: "mới hôm nay",
      changeColor: "text-green-600",
    },
    {
      title: "DOANH THU",
      value: formatCurrency(stats.revenue),
      change: `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}%`,
      icon: DollarSign,
      subtitle: "so với tháng trước",
      changeColor: stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeColor}>{stat.change}</span>{" "}
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
