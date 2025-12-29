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
  Cell,
} from "recharts";
import { adminAPI } from "@/services/admin.api";
import type { CategoryDistribution } from "../types";
import { toast } from "sonner";

/**
 * Chart: Phân bố sản phẩm theo danh mục
 */
export function CategoryDistributionChart() {
  const [data, setData] = useState<CategoryDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getCategoryDistribution();
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch category distribution:", error);
        toast.error("Không thể tải dữ liệu phân bố danh mục");
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
          <CardTitle>Phân bố theo danh mục</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-75">
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = [
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#3b82f6",
    "#10b981",
    "#6366f1",
    "#ef4444",
    "#a855f7",
  ];

  const chartData = data.map((item, index) => ({
    category: item.tenDanhMuc,
    products: item.soLuongSanPham,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bố theo danh mục</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tổng số: {chartData.reduce((sum, item) => sum + item.products, 0)} sản
          phẩm
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={12} />
            <YAxis
              dataKey="category"
              type="category"
              fontSize={12}
              width={80}
            />
            <Tooltip />
            <Bar dataKey="products" name="Sản phẩm" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
