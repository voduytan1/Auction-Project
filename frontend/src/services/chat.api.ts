import api from "./api";

/**
 * Chat Message DTOs - Aligned with ChatMessageResponse.java
 */
export interface ChatMessage {
  messageid: number;
  transactionid: number;
  senderid: string;
  senderName: string;
  senderAvatar?: string;
  messageContent: string;
  messageType?: string;
  attachmentUrl?: string;
  isRead: boolean;
  isSentByMe?: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  transactionid: number;
  messageContent: string;
}

export interface ChatConversationResponse {
  transactionId: number;
  productName: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

/**
 * Chat API - Real-time messaging between buyer and seller
 * Aligned with ChatController.java endpoints
 */
export const chatAPI = {
  /**
   * POST /chat/send - Send a new message
   */
  sendMessage: (data: SendMessageRequest) =>
    api.post<ChatMessage>("/chat/send", data),

  /**
   * GET /chat/transaction/{transactionId} - Get all messages for a transaction with pagination
   * Query params: page, size, sort
   */
  getMessages: (
    transactionId: number,
    params?: { page?: number; size?: number }
  ) => api.get<ChatMessage[]>(`/chat/transaction/${transactionId}`, { params }),

  /**
   * GET /chat/conversation/{transactionId} - Get conversation info
   */
  getConversation: (transactionId: number) =>
    api.get<ChatConversationResponse>(`/chat/conversation/${transactionId}`),

  /**
   * POST /chat/transaction/{transactionId}/read - Mark all messages in transaction as read
   */
  markAsRead: (transactionId: number) =>
    api.post<void>(`/chat/transaction/${transactionId}/read`),

  /**
   * GET /chat/transaction/{transactionId}/unread - Get unread message count for transaction
   */
  getUnreadCount: (transactionId: number) =>
    api.get<number>(`/chat/transaction/${transactionId}/unread`),

  /**
   * GET /chat/conversations - Get all conversations for current user
   */
  getMyConversations: () =>
    api.get<ChatConversationResponse[]>("/chat/conversations"),

  /**
   * DELETE /chat/transaction/{transactionId} - Delete conversation (admin only)
   */
  deleteConversation: (transactionId: number) =>
    api.delete<void>(`/chat/transaction/${transactionId}`),
};
