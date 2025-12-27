import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppSelector } from "@/hooks/use-redux";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "bid" | "transaction" | "product" | "system";
  timestamp: Date;
  read: boolean;
  link?: string;
  productId?: number;
  transactionId?: number;
}

const MAX_NOTIFICATIONS = 50;
const STORAGE_KEY = "auction_notifications";

export function NotificationBell() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        );
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

//   // Add new notification
//   const addNotification = (
//     notification: Omit<Notification, "id" | "timestamp" | "read">
//   ) => {
//     const newNotification: Notification = {
//       ...notification,
//       id: `${Date.now()}-${Math.random()}`,
//       timestamp: new Date(),
//       read: false,
//     };

//     setNotifications((prev) => {
//       const updated = [newNotification, ...prev];
//       // Keep only last MAX_NOTIFICATIONS
//       return updated.slice(0, MAX_NOTIFICATIONS);
//     });
//   };

  // Listen to WebSocket events
  useEffect(() => {
    if (!user) return;

    // Note: Since we don't have user-specific WebSocket subscriptions yet,
    // we'll add this as a placeholder for future implementation
    // When backend adds /topic/user/{userId}/notifications, we can subscribe here

    // For now, we can listen to general events if needed
    // This is where you would add webSocketService.subscribeToUserNotifications(userId, callback)

    return () => {
      // Cleanup subscriptions
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);

    if (notification.link) {
      navigate(notification.link);
    } else if (notification.transactionId) {
      navigate(`/transactions/${notification.transactionId}/detail`);
    } else if (notification.productId) {
      navigate(`/products/${notification.productId}`);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bid":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "transaction":
        return <Bell className="h-5 w-5 text-green-500" />;
      case "product":
        return <Bell className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-base">Thông báo</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-xs hover:bg-gray-100"
                >
                  Đánh dấu đã đọc
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>
        <ScrollArea className="h-112.5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Chưa có thông báo
              </p>
              <p className="text-xs text-gray-500">
                Các thông báo của bạn sẽ hiển thị ở đây
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                    !notification.read
                      ? "bg-blue-50/50 border-l-blue-500"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-tight ${
                          !notification.read
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <span>•</span>
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
