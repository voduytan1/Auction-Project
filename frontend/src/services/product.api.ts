import api from "./api";
import type { ApiResponse } from "@/types/types";

/**
 * Product DTOs matching backend
 */
export interface CreateProductRequest {
  tenSanPham: string;
  moTa: string;
  giaKhoiDiem: number; // BigDecimal - minimum 1000
  buocGia: number; // BigDecimal - minimum 1000
  giaMuaNgay?: number; // BigDecimal - optional buy now price
  categoryId: number; // Long
  durationInHours: number; // minimum 1 hour
  images: string[]; // Array of image URLs (minimum 3)
  choPhepTuDongGiaHan?: boolean; // Default false
  choPhepBidderChuaDanhGia?: boolean; // Default true
}

export interface DescriptionHistoryResponse {
  id: number;
  content: string;
  appendedAt: string; // LocalDateTime
  appendedBy: string; // Username
}

export interface ProductResponse {
  productid: number;
  tenSanPham: string;
  moTa: string;
  giaKhoiDiem: number;
  buocGia: number;
  giaHienTai: number;
  giaMuaNgay?: number;
  createdAt: string; // LocalDateTime
  thoiGianKetThuc: string; // LocalDateTime
  trangThai: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

  // Category info
  categoryId: number;
  tenDanhMuc: string;
  parentCategoryId?: number;
  tenDanhMucCha?: string;

  // Seller info
  tenSeller: string;
  diemDanhGiaSeller?: number;
  anhDaiDienSeller?: string;

  // Bidder info (highest bidder)
  tenBidder?: string;
  diemDanhGiaBidder?: number;

  images: string[];
  sellerId: string;
}

/**
 * Product API endpoints - Aligned with backend ProductController
 */
export const productAPI = {
  /**
   * POST /products - Create new product (seller only)
   * Requires authentication
   */
  create: (data: CreateProductRequest) =>
    api.post<ProductResponse>("/products", data),

  /**
   * POST /products/{id}/description - Append description to product
   * Seller only - appends new content to existing description
   */
  appendDescription: (id: number | string, content: string) =>
    api.post<DescriptionHistoryResponse>(`/products/${id}/description`, {
      content,
    }),

  /**
   * GET /products/{id}/description-history - Get all description updates
   */
  getDescriptionHistory: (id: number | string) =>
    api.get<DescriptionHistoryResponse[]>(
      `/products/${id}/description-history`
    ),

  /**
   * GET /products/{id} - Get product by ID
   */
  getById: (id: number | string) => api.get<ProductResponse>(`/products/${id}`),

  /**
   * GET /products - Search products with filters
   * Query params: search, size, page, categoryId, minPrice, maxPrice
   * Backend handles Vietnamese full-text search automatically
   * Response: ApiResponse<ProductResponse[]> with metadata field
   */
  search: (params?: {
    search?: string;
    size?: number;
    page?: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get<ApiResponse<ProductResponse[]>>("/products", { params }),

  // TODO: Add when backend implements these endpoints
  // getAll: (params?: { page?: number; size?: number; search?: string; categoryId?: number; status?: string }) =>
  //   api.get<PaginatedResponse<ProductResponse>>("/products", { params }),

  // update: (id: number, data: UpdateProductRequest) =>
  //   api.put<ProductResponse>(`/products/${id}`, data),

  // delete: (id: number) =>
  //   api.delete<void>(`/products/${id}`),

  // placeBid: (id: number, amount: number) =>
  //   api.post<BidHistoryResponse>(`/products/${id}/bids`, { amount }),

  // getBidHistory: (id: number) =>
  //   api.get<BidHistoryResponse[]>(`/products/${id}/bids`),
};
