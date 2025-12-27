import { useState } from "react";
import { useTransactionWebSocket } from "@/hooks/use-transaction-websocket";
import { useNotifications } from "@/hooks/use-notification";
import type { TransactionStatusMessage } from "@/types/websocket";
import type { TransactionStatus } from "@/types/transaction";
import { Truck, CheckCircle2, AlertCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransactionNotificationProps {
  transactionId: number;
  onStatusChange?: (message: TransactionStatusMessage) => void;
}

export function TransactionNotification({
  transactionId,
  onStatusChange,
}: TransactionNotificationProps) {
  const [notification, setNotification] =
    useState<TransactionStatusMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { addNotification } = useNotifications();

  useTransactionWebSocket({
    transactionId,
    onStatusChange: (message) => {
      // Show toast notification
      setNotification(message);
      setIsVisible(true);
      onStatusChange?.(message);

      // Add to notification center
      const statusText: Record<TransactionStatus, string> = {
        PENDING_PAYMENT: "Chờ thanh toán",
        PAYMENT_COMPLETED: "Đã thanh toán",
        AWAITING_SHIPMENT: "Chờ gửi hàng",
        SHIPPED: "Đã gửi hàng",
        COMPLETED: "Hoàn tất",
        CANCELLED: "Đã hủy",
      };

      addNotification({
        type: "transaction",
        title: "Cập nhật giao dịch",
        message: `${message.message} - Trạng thái: ${
          statusText[message.trangThai] || message.trangThai
        }`,
        transactionId,
      });

      // Auto-hide after 6 seconds
      setTimeout(() => setIsVisible(false), 6000);
    },
  });

  if (!isVisible || !notification) return null;

  const getIcon = (status: string) => {
    switch (status) {
      case "PAYMENT_COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "AWAITING_SHIPMENT":
      case "SHIPPED":
      case "DELIVERED":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING_PAYMENT: "Chờ thanh toán",
      PAYMENT_COMPLETED: "Đã thanh toán",
      AWAITING_SHIPMENT: "Chờ gửi hàng",
      SHIPPED: "Đã gửi hàng",
      DELIVERED: "Đã giao hàng",
      COMPLETED: "Hoàn tất",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 max-w-md animate-in fade-in slide-in-from-bottom-2 z-50",
        "bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{getIcon(notification.trangThai)}</div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            Cập nhật giao dịch
          </p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            Trạng thái:{" "}
            <span className="font-medium">
              {getStatusText(notification.trangThai)}
            </span>
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
