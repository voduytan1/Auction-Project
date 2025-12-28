import api from "./api";
import type { ApiResponse } from "@/types/types";

/**
 * Product Question DTOs matching backend
 */
export interface ProductQuestionResponse {
  questionId: number;
  productId: number;
  askerId: string; // UUID
  tenNguoiHoi: string;
  anhDaiDienNguoiHoi?: string;
  diemDanhGiaNguoiHoi?: number;
  noiDungCauHoi: string;
  noiDungTraLoi?: string;
  thoiGianHoi: string; // LocalDateTime
  thoiGianTraLoi?: string; // LocalDateTime
}

export interface CreateProductQuestionRequest {
  productId: number;
  noiDungCauHoi: string;
}

export interface AnswerProductQuestionRequest {
  productId: number;
  noiDungTraLoi: string;
}

/**
 * Product Question API endpoints
 */
export const questionAPI = {
  /**
   * GET /questions - Get all questions for a product with pagination
   * Query params: productId (required), page, size, sortBy, sortOrder
   */
  getByProduct: (params: {
    productId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) =>
    api.get<ApiResponse<ProductQuestionResponse[]>>("/questions", { params }),

  /**
   * POST /questions - Create a new question (requires auth)
   */
  create: (data: CreateProductQuestionRequest) =>
    api.post<ProductQuestionResponse>("/questions", data),

  /**
   * PATCH /questions/{id} - Answer a question (seller only, requires auth)
   */
  answer: (data: {
    questionId: number;
    productId: number;
    noiDungTraLoi: string;
  }) =>
    api.patch<ProductQuestionResponse>(`/questions/${data.questionId}`, {
      productId: data.productId,
      noiDungTraLoi: data.noiDungTraLoi,
    }),
};
