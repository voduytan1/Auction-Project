import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gavel, TrendingUp, DollarSign } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      title: "Tổng Users",
      value: "1,234",
      change: "+20%",
      icon: Users,
      subtitle: "so với tháng trước",
    },
    {
      title: "Auctions đang diễn ra",
      value: "42",
      change: "+5",
      icon: Gavel,
      subtitle: "mới hôm nay",
    },
    {
      title: "Tổng Bids",
      value: "8,945",
      change: "+180",
      icon: TrendingUp,
      subtitle: "từ hôm qua",
    },
    {
      title: "Doanh thu",
      value: "1.2B VNĐ",
      change: "+12%",
      icon: DollarSign,
      subtitle: "so với tháng trước",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span>{" "}
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
