import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { History, Lock, Ban } from "lucide-react";
import { SimplePagination } from "@/components/SimplePagination";
import { useBidWebSocket } from "@/hooks/use-bid-websocket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { productAPI } from "@/services/product.api";
import type { BidHistory } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/hooks/use-redux";
import { Link, useNavigate } from "react-router";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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

export function BidHistoryTable({
  productId,
  initialSize = 5,
  sellerId,
}: BidHistoryTableProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [bids, setBids] = useState<BidHistory[]>([]);
  const [page, setPage] = useState(1);
  const size = initialSize;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Block bidder states
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState<{
    bidderId: string;
    bidderName: string;
  } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  // Check if current user is the seller of this product
  const isOwner = useMemo(() => {
    if (!sellerId || !user?.userid) return false;
    return String(sellerId) === String(user.userid);
  }, [sellerId, user?.userid]);

  // Fetch bid history based on user role
  const fetchBidHistory = useCallback(async () => {
    console.log(
      "[BidHistory] fetchBidHistory called, page:",
      page,
      "isOwner:",
      isOwner
    );
    try {
      setLoading(true);
      setError(null);

      // Seller of product: fetch paginated history
      // Other users: fetch top N only (masked names)
      if (isOwner) {
        // API expects 0-based page, but we use 1-based internally
        const response = await bidAPI.getBidHistory(productId, {
          page,
          size,
        });

        const bidsData = Array.isArray(response.data) ? response.data : [];
        console.log(
          "[BidHistory] Owner received",
          bidsData.length,
          "bids, setting state..."
        );
        setBids(bidsData);

        // Extract total from metadata (__raw__?.metadata or __metadata__)
        const metadata =
          (response as any).__raw__?.metadata || (response as any).__metadata__;
        const totalCount = metadata?.totalElements || bidsData.length;
        setTotal(totalCount);
      } else {
        // Non-owner: fetch top N bids only
        const response = await bidAPI.getBidHistoryTop(productId, size);
        const bidsData = Array.isArray(response.data) ? response.data : [];
        console.log(
          "[BidHistory] Non-owner received",
          bidsData.length,
          "bids, setting state..."
        );
        setBids(bidsData);
        setTotal(bidsData.length);
      }
    } catch (error) {
      console.error("Fetch bid history failed", error);
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [productId, page, size, isOwner]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBidHistory();
  }, [isAuthenticated, fetchBidHistory]);

  // Use ref to always have the latest fetchBidHistory function and isOwner flag
  const fetchBidHistoryRef = useRef(fetchBidHistory);
  const isOwnerRef = useRef(isOwner);

  useEffect(() => {
    fetchBidHistoryRef.current = fetchBidHistory;
    isOwnerRef.current = isOwner;
  }, [fetchBidHistory, isOwner]);

  // WebSocket integration - update bid history directly from WebSocket data
  useBidWebSocket({
    productId,
    onBidUpdate: useCallback((_message: unknown) => {
      console.log("[WS] BidHistoryTable: onBidUpdate received");
      // Only owner (seller) needs to refetch API for full paginated history
      // Non-owner gets updates via onBidHistory WebSocket
      if (isOwnerRef.current) {
        console.log("[WS] Owner detected, refetching full history...");
        fetchBidHistoryRef.current();
      }
    }, []),
    onBidHistory: useCallback((messages: any[]) => {
      console.log(
        "[WS] BidHistoryTable: onBidHistory received",
        messages.length,
        "items"
      );
      // Non-owner: Directly update bid history from WebSocket (top N bids)
      // This is sent to /topic/product/{id}/history when new bid happens
      // Owner will ignore this and use API data from onBidUpdate instead
      if (!isOwnerRef.current) {
        console.log("[WS] Non-owner, updating from WebSocket data");
        setBids(messages);
        setTotal(messages.length);
      }
    }, []),
    enabled: isAuthenticated && productId > 0,
  });

  const totalPages = total > 0 ? Math.ceil(total / size) : 1;
  const shouldShowPagination = total > size;

  const handleBlockBidder = (bidderId: string, bidderName: string) => {
    setSelectedBidder({ bidderId, bidderName });
    setBlockReason("");
    setBlockDialogOpen(true);
  };

  const confirmBlockBidder = async () => {
    if (!selectedBidder) return;

    try {
      setIsBlocking(true);
      await productAPI.blockBidder({
        productid: productId,
        bidderid: selectedBidder.bidderId,
        lyDo: blockReason.trim() || undefined,
      });

      toast.success(`Đã từ chối lượt ra giá của ${selectedBidder.bidderName}`);
      setBlockDialogOpen(false);
      setSelectedBidder(null);
      setBlockReason("");

      // Refresh bid history
      fetchBidHistory();
    } catch (error) {
      console.error("Error blocking bidder:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Không thể từ chối lượt ra giá"
      );
    } finally {
      setIsBlocking(false);
    }
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
                    {isOwner && user?.vaitro === "SELLER" && (
                      <th className="pr-4 sm:pr-0 pb-3 text-right text-xs sm:text-sm font-semibold text-slate-600">
                        Hành động
                      </th>
                    )}
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
                        {bid.bidderId && isOwner ? (
                          <Link
                            to={`/users/${bid.bidderId}/ratings`}
                            className="font-mono text-xs sm:text-sm font-semibold hover:text-primary hover:underline transition-colors"
                            title="Xem chi tiết đánh giá"
                          >
                            {bid.tenBidder || bid.bidderName}
                          </Link>
                        ) : (
                          <span className="font-mono text-xs sm:text-sm font-semibold">
                            {bid.tenBidder || bid.bidderName}
                          </span>
                        )}
                        {index === 0 &&
                          page === 1 && ( // <--- Thêm điều kiện page === 1
                            <span className="hidden sm:inline-block ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                              Cao nhất
                            </span>
                          )}
                      </td>
                      <td className="pr-4 sm:pr-0 py-3 text-right">
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
                            // Cũng sửa luôn màu chữ cho đồng bộ
                            index === 0 && page === 1 ? "text-accent" : ""
                          }`}
                        >
                          {formatCurrency(bid.giaDat)}
                        </span>
                      </td>
                      {isOwner && user?.vaitro === "SELLER" && (
                        <td className="pr-4 sm:pr-0 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleBlockBidder(
                                bid.bidderId ?? "",
                                bid.tenBidder ?? ""
                              )
                            }
                            disabled={!bid.bidderId}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        </td>
                      )}
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
              <SimplePagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={total}
                pageSize={size}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </CardContent>

      {!isAuthenticated && (
        <LoginOverlay onLogin={() => navigate("/auth/login")} />
      )}

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối lượt ra giá</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn từ chối lượt ra giá của{" "}
              <span className="font-semibold">
                {selectedBidder?.bidderName}
              </span>
              ?
              <br />
              <span className="text-destructive font-medium">
                Người này sẽ không thể đấu giá sản phẩm này nữa.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do từ chối (tùy chọn)</Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do từ chối..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlockDialogOpen(false)}
              disabled={isBlocking}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBlockBidder}
              disabled={isBlocking}
            >
              {isBlocking ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
