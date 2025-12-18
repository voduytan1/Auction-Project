import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import type { BidHistory } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface BidHistoryTableProps {
  bidHistory: BidHistory[];
}

export function BidHistoryTable({ bidHistory }: BidHistoryTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử đấu giá ({bidHistory.length} lượt)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-sm font-semibold text-slate-600">
                  Thời điểm
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-600">
                  Người mua
                </th>
                <th className="pb-3 text-right text-sm font-semibold text-slate-600">
                  Giá
                </th>
              </tr>
            </thead>
            <tbody>
              {bidHistory.map((bid, index) => (
                <tr
                  key={bid.id}
                  className={`border-b last:border-0 ${
                    index === 0 ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="py-3 text-sm">
                    {formatDistanceToNow(new Date(bid.timestamp), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-sm font-semibold">
                      {bid.bidderName}
                    </span>
                    {index === 0 && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                        Cao nhất
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-semibold ${
                        index === 0 ? "text-accent" : ""
                      }`}
                    >
                      {formatCurrency(bid.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bidHistory.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            Chưa có lượt đấu giá nào
          </div>
        )}
      </CardContent>
    </Card>
  );
}
