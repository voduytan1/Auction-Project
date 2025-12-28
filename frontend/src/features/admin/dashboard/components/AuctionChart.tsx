import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardApi } from "@/services";
import type { ProductDataPoint } from "@/services";
import { toast } from "sonner";

/**
 * Chart: Số lượng sản phẩm mới và hoàn thành theo thời gian
 */
export function AuctionChart() {
  const [data, setData] = useState<ProductDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getProductThisYear();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        toast.error("Không thể tải dữ liệu sản phẩm");
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
          <CardTitle>Số lượng sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-75">
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: `T${item.month}`,
    auctions: item.newProduct,
    completed: item.completedProduct,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng sản phẩm</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sản phẩm mới và hoàn thành theo tháng
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="auctions"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Sản phẩm mới"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              name="Đã hoàn thành"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
