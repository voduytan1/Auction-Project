import { useState } from "react";
import { useBidWebSocket } from "@/hooks/use-bid-websocket";
import { useNotifications } from "@/hooks/use-notification";
import type { BidUpdateMessage } from "@/types/websocket";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BidNotificationProps {
  productId: number;
  onBidUpdate?: (message: BidUpdateMessage) => void;
}

export function BidNotification({
  productId,
  onBidUpdate,
}: BidNotificationProps) {
  const [notification, setNotification] = useState<BidUpdateMessage | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const { addNotification } = useNotifications();

  useBidWebSocket({
    productId,
    onBidUpdate: (message) => {
      // Show toast notification for seller
      setNotification(message);
      setIsVisible(true);
      onBidUpdate?.(message);

      // Add to notification center
      addNotification({
        type: "bid",
        title:
          {
            NEW_BID: "Lượt đấu giá mới",
            AUTO_BID: "Tự động nâng giá",
            BUY_NOW: "Mua ngay",
          }[message.eventType] || message.eventType,
        message: `${message.message} - Giá: ₫${
          message.giaHienTai?.toLocaleString?.("vi-VN") || "0"
        }`,
        productId,
      });

      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    },
  });

  if (!isVisible || !notification) return null;

  const getEventTypeText = (eventType: string) => {
    const typeMap: Record<string, string> = {
      NEW_BID: "Lượt đấu giá mới",
      AUTO_BID: "Tự động nâng giá",
      BUY_NOW: "Mua ngay",
    };
    return typeMap[eventType] || eventType;
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "NEW_BID":
        return "text-blue-500";
      case "AUTO_BID":
        return "text-orange-500";
      case "BUY_NOW":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 max-w-md animate-in fade-in slide-in-from-bottom-2 z-50",
        "bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 mt-0.5",
            getEventTypeColor(notification.eventType)
          )}
        >
          <TrendingUp className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {getEventTypeText(notification.eventType)}
          </p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Người đặt: {notification.currentBidder || "Ẩn danh"}</span>
            <span className="font-medium text-gray-900">
              ₫{notification.giaHienTai?.toLocaleString?.("vi-VN") || "0"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Lượt đấu giá:{" "}
            <span className="font-medium">{notification.soLuotRaGia}</span>
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
