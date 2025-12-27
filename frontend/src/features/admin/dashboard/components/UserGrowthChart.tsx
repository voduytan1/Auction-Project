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

/**
 * Chart: Người dùng mới đăng ký
 */
export function UserGrowthChart() {
  // Mock data - Người dùng mới 12 tháng gần đây
  const data = [
    { month: "T1", bidders: 45, sellers: 12 },
    { month: "T2", bidders: 52, sellers: 15 },
    { month: "T3", bidders: 48, sellers: 18 },
    { month: "T4", bidders: 61, sellers: 20 },
    { month: "T5", bidders: 55, sellers: 22 },
    { month: "T6", bidders: 67, sellers: 25 },
    { month: "T7", bidders: 72, sellers: 28 },
    { month: "T8", bidders: 68, sellers: 30 },
    { month: "T9", bidders: 75, sellers: 32 },
    { month: "T10", bidders: 82, sellers: 35 },
    { month: "T11", bidders: 90, sellers: 38 },
    { month: "T12", bidders: 98, sellers: 42 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Người dùng mới</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bidders và Sellers đăng ký mới theo tháng
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
      </CardContent>
    </Card>
  );
}
