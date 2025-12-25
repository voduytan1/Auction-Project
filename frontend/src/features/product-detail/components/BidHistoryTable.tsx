import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { BidHistory } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { auctionAPI } from "@/services/auction.api";
import type { ApiErrorResponse } from "@/types/types";
import type { AxiosError } from "axios";

interface BidHistoryTableProps {
  productId: number;
  initialSize?: number;
  sellerId?: string | number;
}

// Utility: Extract error message from API error
const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return (
      axiosError.response?.data?.message || "Không thể tải lịch sử đấu giá"
    );
  }
  return "Không thể tải lịch sử đấu giá";
};

// Utility: Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component: Login overlay
const LoginOverlay = ({ onLogin }: { onLogin: () => void }) => (
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
      <Button onClick={onLogin} className="mt-2">
        Đăng nhập ngay
      </Button>
    </div>
  </div>
);

// Component: Pagination controls
const PaginationControls = ({
  page,
  totalPages,
  size,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  size: number;
  total: number;
  onPageChange: (newPage: number) => void;
}) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="text-sm text-slate-600">
      Hiển thị {Math.min(page * size + 1, total)} -{" "}
      {Math.min((page + 1) * size, total)} của {total}
    </div>
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm text-slate-600">
        {page + 1}/{totalPages + 1}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export function BidHistoryTable({
  productId,
  initialSize = 5,
  sellerId,
}: BidHistoryTableProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [bids, setBids] = useState<BidHistory[]>([]);
  const [page, setPage] = useState(0);
  const size = initialSize;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is the seller of this product
  const isOwner = useMemo(() => {
    if (!sellerId || !user?.userid) return false;
    return String(sellerId) === String(user.userid);
  }, [sellerId, user?.userid]);

  // Fetch bid history based on user role
  const fetchBidHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const role = user?.vaitro;

      // BIDDER or non-owner SELLER: fetch top N only
      if (role === "BIDDER" || (role === "SELLER" && !isOwner)) {
        const resp = await auctionAPI.getBidHistoryTop(productId, size);
        setBids(resp.data.data || []);
        setTotal(
          resp.data.metadata?.totalElements ?? resp.data.data?.length ?? 0
        );
        return;
      }

      // SELLER who owns this product: fetch full paged history
      if (role === "SELLER" && isOwner) {
        const resp = await auctionAPI.getBidHistoryPaged(productId, {
          page,
          size,
        });
        setBids(resp.data.data || []);
        setTotal(resp.data.metadata?.totalElements ?? 0);
        return;
      }

      // ADMIN or other roles: fetch top
      const resp = await auctionAPI.getBidHistoryTop(productId, size);
      setBids(resp.data.data || []);
      setTotal(
        resp.data.metadata?.totalElements ?? resp.data.data?.length ?? 0
      );
    } catch (error) {
      console.error("Fetch bid history failed", error);
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [productId, page, size, user?.vaitro, isOwner]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBidHistory();
  }, [isAuthenticated, fetchBidHistory]);

  const totalPages = Math.max(0, Math.ceil(total / size) - 1);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Lịch sử đấu giá gần nhất
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-slate-500">Đang tải...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <>
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
                  {bids.map((bid, index) => (
                    <tr
                      key={bid.bidHistoryid}
                      className={`border-b last:border-0 ${
                        index === 0 ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="py-3 text-sm">
                        {formatDistanceToNow(new Date(bid.thoiGianDat), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-sm font-semibold">
                          {bid.tenBidder}
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
                          {formatCurrency(bid.giaDat)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bids.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                Chưa có lượt đấu giá nào
              </div>
            )}

            {total > 0 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                size={size}
                total={total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </CardContent>

      {!isAuthenticated && (
        <LoginOverlay onLogin={() => navigate("/auth/login")} />
      )}
    </Card>
  );
}
