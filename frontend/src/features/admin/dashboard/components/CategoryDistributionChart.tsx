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

/**
 * Chart: Phân bố sản phẩm theo danh mục
 */
export function CategoryDistributionChart() {
  // Mock data - Số lượng sản phẩm theo danh mục
  const data = [
    { category: "Điện tử", products: 245, color: "#8b5cf6" },
    { category: "Thời trang", products: 189, color: "#ec4899" },
    { category: "Gia dụng", products: 156, color: "#f59e0b" },
    { category: "Thể thao", products: 142, color: "#3b82f6" },
    { category: "Sách", products: 98, color: "#10b981" },
    { category: "Khác", products: 67, color: "#6366f1" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bố theo danh mục</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tổng số: {data.reduce((sum, item) => sum + item.products, 0)} sản phẩm
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
