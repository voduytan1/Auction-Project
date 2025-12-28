import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { History, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import type { BidHistory } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { bidAPI } from "@/services/bid.api";
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
        {page + 1}/{totalPages}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
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
        const resp = await bidAPI.getBidHistoryTop(productId, size);
        const bidsData = Array.isArray(resp.data) ? resp.data : [];
        setBids(bidsData);
        setTotal(bidsData.length);
        return;
      }

      // SELLER who owns this product: fetch full paged history
      if (role === "SELLER" && isOwner) {
        const resp = await bidAPI.getBidHistory(productId, {
          page,
          size,
        });
        const bidsData = Array.isArray(resp.data) ? resp.data : [];
        setBids(bidsData);
        setTotal(bidsData.length);
        return;
      }

      // ADMIN or other roles: fetch top
      const resp = await bidAPI.getBidHistoryTop(productId, size);
      const bidsData = Array.isArray(resp.data) ? resp.data : [];
      setBids(bidsData);
      setTotal(bidsData.length);
    } catch (error) {
      console.error("❌ Fetch bid history failed", error);
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [productId, page, size, user?.vaitro, isOwner]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBidHistory();
  }, [isAuthenticated, fetchBidHistory]);

  const totalPages = total > 0 ? Math.ceil(total / size) : 1;
  const shouldShowPagination = total > size;

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
          <PageLoader message="Đang tải lịch sử đấu giá..." className="py-8" />
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-87.5">
                <thead>
                  <tr className="border-b">
                    <th className="pl-4 sm:pl-0 pb-3 text-left text-xs sm:text-sm font-semibold text-slate-600">
                      Thời điểm
                    </th>
                    <th className="pb-3 text-left text-xs sm:text-sm font-semibold text-slate-600">
                      Người mua
                    </th>
                    <th className="pr-4 sm:pr-0 pb-3 text-right text-xs sm:text-sm font-semibold text-slate-600">
                      Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid, index) => (
                    <tr
                      key={bid.bidHistoryId}
                      className={`border-b last:border-0 ${
                        index === 0 ? "bg-accent/5" : ""
                      }`}
                    >
                      <td className="pl-4 sm:pl-0 py-3 text-xs sm:text-sm whitespace-nowrap">
                        {formatDistanceToNow(new Date(bid.thoiGianDat), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </td>
                      <td className="py-3 max-w-25 truncate sm:max-w-none">
                        <span className="font-mono text-xs sm:text-sm font-semibold">
                          {bid.bidderName}
                        </span>
                        {index === 0 && (
                          <span className="hidden sm:inline-block ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                            Cao nhất
                          </span>
                        )}
                      </td>
                      <td className="pr-4 sm:pr-0 py-3 text-right">
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
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

            {shouldShowPagination && (
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
