import api from "./api";

/**
 * Rating Request/Response Types
 */
export interface CreateRatingRequest {
  transactionId: number;
  rateeId: string; // UUID of user being rated
  diem: 1 | -1; // +1 or -1 only
  nhanXet: string; // Comment
}

export interface RatingResponse {
  ratingid: number;
  raterid: string; // UUID
  tenRater: string; // Người đánh giá
  rateeid: string; // UUID
  tenRatee: string; // Người được đánh giá
  productid: number;
  tenSanPham: string;
  diem: number;
  nhanXet: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Rating API Service
 * Quản lý đánh giá sau giao dịch
 */
export const ratingAPI = {
  /**
   * Đánh giá người khác trong giao dịch
   * - Transaction phải ở trạng thái COMPLETED hoặc CANCELLED
   * - Chỉ buyer/seller trong transaction mới đánh giá được
   * - Không được đánh giá chính mình
   * - Không được đánh giá 2 lần cùng 1 sản phẩm
   */
  createRating: (data: CreateRatingRequest) =>
    api.post<RatingResponse>("/rating", data),

  /**
   * GET /rating/mine - Lấy danh sách rating mà mình đã đánh giá người khác
   * Requires authentication
   */
  getMyRatings: (params?: { page?: number; size?: number }) =>
    api.get<{ data: RatingResponse[]; metadata: any }>("/rating/mine", {
      params,
    }),

  /**
   * GET /rating/{id} - Lấy danh sách rating của một user (những rating mà user đó nhận được)
   * Public endpoint - không cần authentication
   */
  getRatingsOfUser: (
    userId: string,
    params?: { page?: number; size?: number }
  ) =>
    api.get<{ data: RatingResponse[]; metadata: any }>(`/rating/${userId}`, {
      params,
    }),
};
