/**
 * Type definitions for API responses and requests
 * Generated from backend entities and DTOs
 */

// ============= Enums =============
export type Role = "BIDDER" | "SELLER" | "ADMIN";

export type ProductStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type TransactionStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type UpgradeRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// ============= User Types =============
export interface User {
  userid: string; // UUID from backend
  username: string;
  email: string;
  vaitro: Role;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string; // LocalDate from backend
  anhDaiDien?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for API responses
export interface UserResponse {
  id: string; // UUID (UserResponse uses 'id', not 'userid')
  username: string;
  email: string;
  vaitro: Role;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string; // LocalDate from backend
  anhDaiDien?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating user
export interface CreateUserRequest {
  username: string; // 3-50 chars
  password: string; // 6-100 chars
  email: string;
  vaitro: Role;
  hoVaTen?: string; // max 100 chars
  anhDaiDien?: string;
}

// DTO for updating user
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  vaitro?: Role;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  anhDaiDien?: string;
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
// Entity from backend
export interface Category {
  categoryid: number; // Long from backend (changed from UUID)
  tenDanhMuc: string;
  level: number; // 1 = parent, 2 = child
  parentCategory?: Category;
  moTa?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO from backend API responses
export interface CategoryResponse {
  categoryid: number;
  tenDanhMuc: string;
  parentCategoryId?: number; // Flattened from parent
  parentCategoryName?: string; // Flattened from parent
  level: number;
  moTa?: string;
}

// Helper interfaces for frontend display
export interface CategoryDisplay {
  id: number;
  name: string;
  slug: string;
  level: number;
  parentId?: number;
  parentName?: string;
  description?: string;
  subcategories?: CategoryDisplay[];
}

// ============= Product Types (Auction Items) =============
export interface Product {
  productid: number; // From backend
  tenSanPham: string;
  moTa?: string;
  giaKhoiDiem: number; // BigDecimal
  buocGia: number; // BigDecimal
  giaHienTai: number; // BigDecimal
  giaMuaNgay?: number; // BigDecimal
  anhDaiDien?: string;
  choPhepTuDongGiaHan: boolean;
  choPhepBidderChuaDanhGia: boolean;
  trangThai: ProductStatus;
  thoiGianKetThuc: string; // LocalDateTime
  soLuotRaGia: number;
  category: Category;
  seller: User;
  currentBidder?: User;
  createdAt: string;
  updatedAt: string;
}

// Helper interface for frontend display
export interface ProductDisplay {
  id: number;
  title: string;
  description?: string;
  startingPrice: number;
  currentPrice: number;
  stepPrice: number;
  buyNowPrice?: number;
  thumbnailImage?: string;
  allowAutoExtend: boolean;
  allowUnratedBidders: boolean;
  status: ProductStatus;
  endTime: string;
  bidCount: number;
  categoryId: string;
  categoryName: string;
  sellerId: string;
  sellerName: string;
  currentBidderId?: string;
  currentBidderName?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Bid Types =============
export interface BidHistory {
  bidHistoryid: number;
  product: Product;
  bidder: User;
  giaDat: number; // BigDecimal
  thoiGianDat: string; // LocalDateTime
}

export interface PlaceBidData {
  productId: number;
  amount: number;
}

// ============= Auto Bid Types =============
export interface AutoBid {
  autoBidid: number;
  product: Product;
  bidder: User;
  giaToiDa: number; // BigDecimal
  createdAt: string;
  updatedAt: string;
}

// ============= Blocked Bidder Types =============
export interface BlockedBidder {
  blockedBidderid: number;
  product: Product;
  bidder: User;
  seller: User;
  lyDoChanBidder?: string;
  createdAt: string;
}

// ============= Rating Types =============
export interface Rating {
  ratingid: number;
  rater: User; // Người đánh giá
  ratee: User; // Người được đánh giá
  product: Product;
  diem: number; // +1 or -1
  nhanXet?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Watchlist Types =============
export interface WatchList {
  watchListid: number;
  user: User;
  product: Product;
  createdAt: string;
}

// ============= Product Question Types =============
export interface ProductQuestion {
  productQuestionid: number;
  product: Product;
  questioner: User;
  cauHoi: string;
  cauTraLoi?: string;
  thoiGianTraLoi?: string; // LocalDateTime
  createdAt: string;
  updatedAt: string;
}

// ============= Product Image Types =============
export interface ProductImage {
  productImageid: number;
  product: Product;
  duongDanAnh: string;
  thuTu: number;
  createdAt: string;
}

// ============= Product Description History Types =============
export interface ProductDescriptionHistory {
  productDescriptionHistoryid: number;
  product: Product;
  moTaCu: string;
  moTaMoi: string;
  thoiGianCapNhat: string; // LocalDateTime
}

// ============= Transaction Types =============
export interface Transaction {
  transactionid: number;
  product: Product;
  buyer: User;
  seller: User;
  giaCuoiCung: number; // BigDecimal
  trangThai: TransactionStatus;
  phuongThucThanhToan?: string;
  thoiGianThanhToan?: string; // LocalDateTime
  diaChiGiaoHang?: string;
  maVanChuyen?: string;
  thoiGianGiaoHang?: string; // LocalDateTime
  thoiGianNhanHang?: string; // LocalDateTime
  createdAt: string;
  updatedAt: string;
}

// ============= Upgrade Request Types =============
export interface UpgradeRequest {
  upgradeRequestid: number;
  user: User;
  trangThai: UpgradeRequestStatus;
  lyDoYeuCau?: string;
  lyDoTuChoi?: string;
  thoiGianDuyet?: string; // LocalDateTime
  adminDuyet?: User;
  createdAt: string;
  updatedAt: string;
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
export interface ProductSearchParams extends PaginationParams {
  categoryId?: string;
  keyword?: string;
  sortBy?: "thoiGianKetThuc" | "giaHienTai" | "createdAt";
  sortOrder?: "asc" | "desc";
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  metadata?: PaginationMetadata;
  timestamp?: string;
}

export interface PaginationMetadata {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  sortBy?: string | null;
  sortOrder?: string | null;
  search?: string | null;
}

export interface MessageResponse {
  message: string;
}

// ============= Error Types =============
export interface ApiErrorResponse {
  error: string;
  message: string;
  path: string | null;
  status: number;
  timestamp: string;
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
