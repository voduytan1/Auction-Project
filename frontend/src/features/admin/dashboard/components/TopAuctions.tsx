import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/admin.api";
import type { TopAuction } from "../types";

export function TopAuctions() {
  const [topAuctions, setTopAuctions] = useState<TopAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopAuctions = async () => {
      try {
        const response = await adminAPI.getTopAuctions();
        setTopAuctions(response.data || []);
      } catch (error) {
        console.error("Error fetching top auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAuctions();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Đấu giá cao nhất</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : topAuctions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu auctions
          </p>
        ) : (
          <div className="space-y-4">
            {topAuctions.map((auction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{auction.tenSanPham}</p>
                  <p className="text-xs text-muted-foreground">
                    {auction.soLuotRaGia} bids
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatCurrency(auction.giaHienTai)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
