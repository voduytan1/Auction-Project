import { useState } from "react";
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
import { useNotifications } from "@/hooks/use-notification";
import type { AppNotification } from "@/contexts/NotificationContext";

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (notification: AppNotification) => {
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

  const getNotificationIcon = (type: AppNotification["type"]) => {
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
                    <span className="text-xl shrink-0 mt-0.5">
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
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
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
