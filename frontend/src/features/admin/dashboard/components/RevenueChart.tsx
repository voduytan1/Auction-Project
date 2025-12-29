import { useState, useEffect } from "react";
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
import { adminAPI } from "@/services/admin.api";
import type { RevenueDataPoint } from "../types";
import { toast } from "sonner";

/**
 * Chart: Doanh thu theo thời gian
 */
export function RevenueChart() {
  const [data, setData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getRevenueThisYear();
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
        toast.error("Không thể tải dữ liệu doanh thu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-75">
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: `T${item.month}`,
    revenue: Number(item.revenue) / 1000000, // Convert to millions
  }));

  const formatRevenue = (value: number) => {
    return `${value.toFixed(1)}M`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <p className="text-sm text-muted-foreground">
          Doanh thu 12 tháng gần đây
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={250} className="sm:h-75">
          <AreaChart data={chartData}>
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
