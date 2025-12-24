import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Lock } from "lucide-react";
import type { BidHistory } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router";

interface BidHistoryTableProps {
  bidHistory: BidHistory[];
}

export function BidHistoryTable({ bidHistory }: BidHistoryTableProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử đấu giá gần nhất
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

      {/* Overlay khi chưa đăng nhập */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-accent/10 p-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">Yêu cầu đăng nhập</h3>
              <p className="text-sm text-slate-600">
                Vui lòng đăng nhập để xem lịch sử đấu giá
              </p>
            </div>
            <Button onClick={() => navigate("/auth/login")} className="mt-2">
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
