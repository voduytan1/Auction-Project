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
  soLuotRaGia?: number; // Number of bids placed

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
  bidderId?: string;
  tenBidder?: string;
  diemDanhGiaBidder?: number;

  images: string[];
  sellerId: string;
  transactionId?: number; // Transaction ID if product is COMPLETED
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
   * PATCH /products - Append description to product
   * Seller only - appends new content to existing description
   * Body: { productId: number, noiDungThem: string }
   */
  appendDescription: (productId: number | string, noiDungThem: string) =>
    api.patch<DescriptionHistoryResponse>("/products", {
      productId: Number(productId),
      noiDungThem,
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
   * Query params: search, size, page, categoryId, minPrice, maxPrice, sortBy, sortOrder, status, sellerId
   * sortBy: 'thoiGianKetThuc' | 'giaHienTai' | 'createdAt' | any other entity field
   * sortOrder: 'asc' | 'desc'
   * status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
   * sellerId: UUID string to filter by seller
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
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    sellerId?: string;
  }) => api.get<ApiResponse<ProductResponse[]>>("/products", { params }),

  /**
   * DELETE /products/{id} - Delete/Remove product (seller or admin only)
   * Only active products can be removed
   */
  delete: (id: number | string) =>
    api.delete<{ message: string }>(`/products/${id}`),
};
