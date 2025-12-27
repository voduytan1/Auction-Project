import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Chart: Yêu cầu nâng cấp Bidder -> Seller
 */
export function UpgradeRequestChart() {
  // Mock data - Trạng thái yêu cầu upgrade
  const data = [
    { name: "Đã duyệt", value: 156, color: "#22c55e" },
    { name: "Đang chờ", value: 42, color: "#f59e0b" },
    { name: "Từ chối", value: 28, color: "#ef4444" },
  ];

  const COLORS = data.map((item) => item.color);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu nâng cấp Seller</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tổng số: {data.reduce((sum, item) => sum + item.value, 0)} yêu cầu
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
