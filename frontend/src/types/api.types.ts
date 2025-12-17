/**
 * Type definitions for API responses and requests
 * Based on Online Auction System Requirements
 */

// ============= User Types =============
export interface User {
  id: string;
  email: string;
  name: string;
  role: "BIDDER" | "SELLER" | "ADMIN";
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  // Rating system: positive/negative ratings
  positiveRatings: number; // số lượt đánh giá +1
  negativeRatings: number; // số lượt đánh giá -1
  // Rating percentage for bid eligibility check
  ratingPercentage: number; // (positiveRatings / totalRatings) * 100
  // Seller upgrade request
  upgradeRequested?: boolean;
  upgradeRequestDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRating {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: User;
  rating: 1 | -1; // +1 or -1
  comment: string;
  auctionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateData {
  name?: string;
  address?: string;
  avatar?: string;
  dateOfBirth?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  pendingUpgrades: number;
}

// ============= Auth Types =============
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "BIDDER" | "SELLER";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// ============= Category Types =============
export interface Category {
  id: string;
  name: string;
  parentId?: string; // For 2-level categories
  parent?: Category;
  children?: Category[];
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ============= Auction Types =============
export interface Auction {
  id: string;
  title: string;
  description: string;
  // Pricing
  startingPrice: number;
  currentPrice: number;
  stepPrice: number; // Bước giá
  buyNowPrice?: number; // Giá mua ngay
  // Timing
  startDate: string;
  endDate: string;
  // Auto-extend settings
  autoExtend: boolean; // Tự động gia hạn
  autoExtendTrigger?: number; // Minutes before end to trigger (default 5)
  autoExtendDuration?: number; // Minutes to extend (default 10)
  // Status
  status: "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED" | "COMPLETED";
  // Relations
  categoryId: string;
  category?: Category;
  sellerId: string;
  seller?: User;
  winnerId?: string;
  winner?: User;
  // Media
  images: string[]; // Min 3 images required
  thumbnailImage: string;
  // Bidding
  bids?: Bid[];
  bidCount: number;
  currentBidderId?: string;
  currentBidder?: User;
  // Questions
  questions?: AuctionQuestion[];
  // Settings
  allowNewBidders: boolean; // Cho phép bidder chưa có đánh giá
  rejectedBidders?: string[]; // List of rejected bidder IDs
  // Metadata
  viewCount: number;
  isNew: boolean; // Sản phẩm mới đăng (trong N phút)
  createdAt: string;
  updatedAt: string;
  // Description updates
  descriptionHistory?: DescriptionUpdate[];
}

export interface DescriptionUpdate {
  content: string;
  updatedAt: string;
}

export interface AuctionCreateData {
  title: string;
  description: string;
  startingPrice: number;
  stepPrice: number;
  buyNowPrice?: number;
  startDate: string;
  endDate: string;
  categoryId: string;
  images: string[]; // Min 3
  autoExtend: boolean;
  autoExtendTrigger?: number;
  autoExtendDuration?: number;
  allowNewBidders: boolean;
}

export interface AuctionUpdateData {
  description?: string; // Append only, không replace
  buyNowPrice?: number;
  endDate?: string;
  status?: "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED" | "COMPLETED";
}

export interface AuctionStats {
  totalAuctions: number;
  activeAuctions: number;
  endedAuctions: number;
  totalBids: number;
  totalRevenue: number;
  newAuctionsToday: number;
}

// ============= Bid Types =============
export interface Bid {
  id: string;
  amount: number;
  maxAmount?: number; // For auto-bidding system
  isAutoBid: boolean; // Đấu giá tự động
  auctionId: string;
  bidderId: string;
  bidder?: User;
  auction?: Auction;
  isRejected: boolean; // Bị seller từ chối
  createdAt: string;
}

export interface PlaceBidData {
  auctionId: string;
  amount: number;
  maxAmount?: number; // For auto-bidding
}

// ============= Watchlist Types =============
export interface WatchlistItem {
  id: string;
  userId: string;
  auctionId: string;
  auction?: Auction;
  createdAt: string;
}

// ============= Question Types =============
export interface AuctionQuestion {
  id: string;
  auctionId: string;
  auction?: Auction;
  questionerId: string;
  questioner?: User;
  question: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface AskQuestionData {
  auctionId: string;
  question: string;
}

export interface AnswerQuestionData {
  questionId: string;
  answer: string;
}

// ============= Order/Transaction Types =============
export interface Order {
  id: string;
  auctionId: string;
  auction?: Auction;
  sellerId: string;
  seller?: User;
  buyerId: string;
  buyer?: User;
  finalPrice: number;
  // Payment
  isPaid: boolean;
  paymentMethod?: string;
  paidAt?: string;
  // Shipping
  shippingAddress?: string;
  trackingNumber?: string;
  isShipped: boolean;
  shippedAt?: string;
  // Completion
  isReceived: boolean;
  receivedAt?: string;
  // Status
  status: "PENDING_PAYMENT" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  // Ratings
  sellerRatingId?: string;
  buyerRatingId?: string;
  // Cancellation
  cancelledBy?: string;
  cancelReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderData {
  shippingAddress?: string;
  trackingNumber?: string;
  status?: "PENDING_PAYMENT" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
}

// ============= Pagination Types =============
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============= Search/Filter Types =============
export interface AuctionSearchParams extends PaginationParams {
  categoryId?: string;
  keyword?: string;
  sortBy?: "endDate" | "price" | "newest";
  sortOrder?: "asc" | "desc";
  status?: "ACTIVE" | "ENDED";
  minPrice?: number;
  maxPrice?: number;
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MessageResponse {
  message: string;
}

// ============= Error Types =============
export interface ApiErrorResponse {
  message: string;
  status: number;
  data: unknown;
}

// ============= Dashboard Types =============
export interface DashboardStats {
  totalRevenue: number;
  newAuctions: number;
  newUsers: number;
  newSellers: number;
  activeAuctions: number;
  completedOrders: number;
}
