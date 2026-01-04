import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { adminAPI } from "@/services/admin.api";
import type { NewUserDataPoint } from "../types";
import { toast } from "sonner";

/**
 * Chart: Người dùng mới đăng ký
 */
export function UserGrowthChart() {
  const [data, setData] = useState<NewUserDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getNewUserThisYear();
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch new user data:", error);
        toast.error("Không thể tải dữ liệu người dùng mới");
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
          <CardTitle>Người dùng mới</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-75">
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    month: `T${item.month}`,
    bidders: item.bidder,
    sellers: item.seller,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>NGƯỜI DÙNG MỚI</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bidders và Sellers đăng ký mới theo tháng
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-62.5 text-muted-foreground">
            <p>Chưa có người dùng mới</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250} className="sm:h-75">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="bidders"
                fill="#3b82f6"
                name="Bidders mới"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="sellers"
                fill="#f59e0b"
                name="Sellers mới"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
