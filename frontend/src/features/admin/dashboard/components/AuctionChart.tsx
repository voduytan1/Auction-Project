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

/**
 * Chart: Số lượng sàn đấu giá mới theo thời gian
 */
export function AuctionChart() {
  // Mock data - Số lượng đấu giá mới trong 30 ngày gần đây
  const data = [
    { date: "01/12", auctions: 12, completed: 8 },
    { date: "02/12", auctions: 15, completed: 10 },
    { date: "03/12", auctions: 10, completed: 12 },
    { date: "04/12", auctions: 18, completed: 9 },
    { date: "05/12", auctions: 22, completed: 15 },
    { date: "06/12", auctions: 20, completed: 18 },
    { date: "07/12", auctions: 25, completed: 20 },
    { date: "08/12", auctions: 18, completed: 22 },
    { date: "09/12", auctions: 30, completed: 16 },
    { date: "10/12", auctions: 28, completed: 25 },
    { date: "11/12", auctions: 32, completed: 28 },
    { date: "12/12", auctions: 35, completed: 30 },
    { date: "13/12", auctions: 28, completed: 32 },
    { date: "14/12", auctions: 30, completed: 28 },
    { date: "15/12", auctions: 26, completed: 30 },
    { date: "16/12", auctions: 24, completed: 26 },
    { date: "17/12", auctions: 27, completed: 24 },
    { date: "18/12", auctions: 31, completed: 27 },
    { date: "19/12", auctions: 29, completed: 31 },
    { date: "20/12", auctions: 33, completed: 29 },
    { date: "21/12", auctions: 36, completed: 33 },
    { date: "22/12", auctions: 40, completed: 36 },
    { date: "23/12", auctions: 38, completed: 40 },
    { date: "24/12", auctions: 42, completed: 38 },
    { date: "25/12", auctions: 45, completed: 42 },
    { date: "26/12", auctions: 48, completed: 45 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng sàn đấu giá</CardTitle>
        <p className="text-sm text-muted-foreground">
          Đấu giá mới và hoàn thành trong 30 ngày qua
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="auctions"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Đấu giá mới"
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
