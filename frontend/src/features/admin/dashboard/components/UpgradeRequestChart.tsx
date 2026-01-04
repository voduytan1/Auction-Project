import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { adminAPI } from "@/services/admin.api";
import type { UpgradeRequestChart } from "../types";
import { toast } from "sonner";

type TimePeriod = "today" | "week" | "month";

/**
 * Chart: Yêu cầu nâng cấp Bidder -> Seller
 */
export function UpgradeRequestChart() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [data, setData] = useState<UpgradeRequestChart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        switch (period) {
          case "today":
            response = await adminAPI.getUpgradeRequestToday();
            break;
          case "week":
            response = await adminAPI.getUpgradeRequestWeek();
            break;
          case "month":
            response = await adminAPI.getUpgradeRequestMonth();
            break;
        }

        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch upgrade request data:", error);
        toast.error("Không thể tải dữ liệu yêu cầu nâng cấp");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu nâng cấp Seller</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-75">
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "Đã duyệt", value: data.approved, color: "#22c55e" },
    { name: "Đang chờ", value: data.pending, color: "#f59e0b" },
    { name: "Từ chối", value: data.rejected, color: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>YÊU CẦU NÂNG CẤP SELLER</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tổng số: {data.total} yêu cầu
            </p>
          </div>
          {/* Select for mobile/tablet */}
          <div className="lg:hidden">
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as TimePeriod)}
            >
              <SelectTrigger className="w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Tabs for large screens */}
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as TimePeriod)}
            className="hidden lg:block"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today" className="text-xs sm:text-sm">
                Hôm nay
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs sm:text-sm">
                Tuần
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs sm:text-sm">
                Tháng
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {data.total === 0 ? (
          <div className="flex flex-col items-center justify-center h-62.5 text-muted-foreground">
            <p className="text-lg font-medium">
              {period === "today"
                ? "Hôm nay chưa có yêu cầu"
                : period === "week"
                ? "Tuần này chưa có yêu cầu"
                : "Tháng này chưa có yêu cầu"}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250} className="sm:h-75">
            <PieChart>
              <Pie
                data={chartData.filter((item) => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData
                  .filter((item) => item.value > 0)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Pie>
              <Tooltip />
              <Legend
                payload={chartData.map((item) => ({
                  value: `${item.name}: ${item.value}`,
                  type: "circle",
                  color: item.color,
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
