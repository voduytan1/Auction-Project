import api from "./api";

/**
 * Chat Message DTOs
 */
export interface ChatMessage {
  id: number;
  transactionId: number;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  transactionId: number;
  message: string;
}

/**
 * Chat API - Real-time messaging between buyer and seller
 * Response giống như login API, không wrap trong ApiResponse
 */
export const chatAPI = {
  /**
   * GET /chat/{transactionId} - Get all messages for a transaction
   */
  getMessages: (transactionId: number) =>
    api.get<ChatMessage[]>(`/chat/${transactionId}`),

  /**
   * POST /chat - Send a new message
   */
  sendMessage: (data: SendMessageRequest) =>
    api.post<ChatMessage>("/chat", data),

  /**
   * PATCH /chat/{messageId}/read - Mark message as read
   */
  markAsRead: (messageId: number) => api.patch<void>(`/chat/${messageId}/read`),

  /**
   * GET /chat/unread-count/{transactionId} - Get unread message count
   */
  getUnreadCount: (transactionId: number) =>
    api.get<number>(`/chat/unread-count/${transactionId}`),
};
