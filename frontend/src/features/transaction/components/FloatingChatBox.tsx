import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MessageCircle,
  X,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { chatAPI, type ChatMessage } from "@/services/chat.api";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useChatWebSocket } from "@/hooks";

interface FloatingChatBoxProps {
  transactionId: number;
  otherUserName: string;
  otherUserAvatar?: string; // Thêm prop này nếu có ảnh
}

export function FloatingChatBox({
  transactionId,
  otherUserName,
  otherUserAvatar,
}: FloatingChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // WebSocket for real-time chat and typing indicator
  const { isOtherUserTyping, startTyping, stopTyping } = useChatWebSocket({
    transactionId,
    enabled: isOpen && !isMinimized,
    onNewMessage: (newMsg: ChatMessage) => {
      // Add new message from WebSocket to state
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some((m) => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
    },
  });

  // Load messages function
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(transactionId);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  // Load messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      loadMessages();
      // Focus input on desktop when opened
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, isMinimized, loadMessages]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = newMessage;
    setNewMessage(""); // Optimistic clear
    stopTyping(); // Stop typing indicator

    try {
      setSending(true);
      const response = await chatAPI.sendMessage({
        transactionId,
        message: tempMessage.trim(),
      });

      // Add message to state (WebSocket will also broadcast it, but we add it immediately for better UX)
      setMessages((prev) => {
        // Check if already exists (from WebSocket)
        const exists = prev.some((m) => m.id === response.data.id);
        if (exists) return prev;
        return [...prev, response.data];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Gửi tin nhắn thất bại");
      setNewMessage(tempMessage); // Restore if failed
    } finally {
      setSending(false);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      // Start typing
      startTyping();

      // Auto stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      // Stop typing if input is empty
      stopTyping();
    }
  };

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  // Helper để lấy avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <>
      {/* 1. Floating Button (Launcher) */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300",
          isOpen
            ? "bottom-4 right-4 opacity-0 pointer-events-none scale-75"
            : "bottom-4 right-4 opacity-100 scale-100"
        )}
      >
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-110 relative"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          {/* Online Indicator Badge (Fake) */}
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
        </Button>
      </div>

      {/* 2. Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-slate-200",
            // Responsive Styles:
            // Mobile: Full screen hoặc bottom sheet lớn
            "inset-0 sm:inset-auto sm:bottom-4 sm:right-4",
            // Desktop: Cố định kích thước
            "sm:w-95 sm:rounded-2xl",
            // Minimized State (Desktop only usually)
            isMinimized
              ? "h-15 sm:h-15 bottom-0 sm:bottom-4"
              : "h-dvh sm:h-150 sm:max-h-[80vh]"
          )}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0 cursor-pointer"
            onClick={() =>
              window.innerWidth > 640 && setIsMinimized(!isMinimized)
            }
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9 border-2 border-white/20">
                  <AvatarImage src={otherUserAvatar} />
                  <AvatarFallback className="bg-primary-foreground/20 text-white text-xs">
                    {getInitials(otherUserName)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-primary"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">
                  {otherUserName}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-primary-foreground/80">
                    • Đang hoạt động
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/20 hidden sm:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scroll-smooth">
                {loading && messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-xs">Đang tải tin nhắn...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 px-8 text-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-3">
                      <MessageCircle className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Bắt đầu trò chuyện
                    </p>
                    <p className="text-xs mt-1">
                      Gửi tin nhắn để trao đổi trực tiếp với {otherUserName}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Timestamp divider example (Optional) */}
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        Hôm nay
                      </span>
                    </div>

                    {messages.map((msg, index) => {
                      const isMe = msg.senderId === user.userid;

                      return (
                        <div
                          key={msg.id || index}
                          className={cn(
                            "flex w-full",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "flex max-w-[80%] sm:max-w-[75%] gap-2",
                              isMe ? "flex-row-reverse" : "flex-row"
                            )}
                          >
                            {/* Avatar for other user inside chat */}
                            {!isMe && (
                              <Avatar className="h-6 w-6 mt-auto shrink-0">
                                <AvatarFallback className="text-[9px] bg-slate-200">
                                  {getInitials(otherUserName)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div>
                              <div
                                className={cn(
                                  "px-3 py-2 text-sm shadow-sm wrap-break-word",
                                  isMe
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                    : "bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
                                )}
                              >
                                {msg.message}
                              </div>
                              <div
                                className={cn(
                                  "text-[10px] text-slate-400 mt-1",
                                  isMe ? "text-right pr-1" : "text-left pl-1"
                                )}
                              >
                                {format(new Date(msg.timestamp), "HH:mm")}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator */}
                    {isOtherUserTyping && (
                      <div className="flex w-full justify-start">
                        <div className="flex max-w-[80%] gap-2">
                          <Avatar className="h-6 w-6 mt-auto shrink-0">
                            <AvatarImage src={otherUserAvatar} />
                            <AvatarFallback className="text-[9px] bg-slate-200">
                              {getInitials(otherUserName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="px-4 py-2.5 bg-white border border-slate-100 rounded-2xl rounded-tl-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                              </div>
                              <span className="text-xs text-slate-500 ml-1">
                                đang gõ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={scrollRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t shrink-0">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2 bg-slate-100 p-1.5 rounded-3xl border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
                >
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={handleInputChange}
                    onBlur={stopTyping}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-4 py-2 min-h-10 max-h-25 text-sm md:text-base"
                    autoComplete="off"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim() || sending}
                    className={cn(
                      "rounded-full h-8 w-8 mb-1 mr-1 transition-all duration-200",
                      newMessage.trim()
                        ? "bg-primary hover:bg-primary/90 scale-100"
                        : "bg-slate-300 hover:bg-slate-300 scale-90 opacity-70"
                    )}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
