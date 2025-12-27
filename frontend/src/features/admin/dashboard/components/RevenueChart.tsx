import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Chart: Doanh thu theo thời gian
 */
export function RevenueChart() {
  // Mock data - Doanh thu 12 tháng gần đây (triệu VNĐ)
  const data = [
    { month: "T1", revenue: 45 },
    { month: "T2", revenue: 52 },
    { month: "T3", revenue: 48 },
    { month: "T4", revenue: 61 },
    { month: "T5", revenue: 55 },
    { month: "T6", revenue: 67 },
    { month: "T7", revenue: 72 },
    { month: "T8", revenue: 68 },
    { month: "T9", revenue: 75 },
    { month: "T10", revenue: 82 },
    { month: "T11", revenue: 90 },
    { month: "T12", revenue: 98 },
  ];

  const formatRevenue = (value: number) => {
    return `${value}M`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <p className="text-sm text-muted-foreground">
          Doanh thu 12 tháng gần đây
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis tickFormatter={formatRevenue} fontSize={12} />
            <Tooltip
              formatter={(value: number) => [`${value} triệu VNĐ`, "Doanh thu"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
