/**
 * Category API Service
 * Handles all category-related API calls
 */

import api from "./api";
import type {
  CategoryResponse,
  CategoryDisplay,
  ApiResponse,
} from "@/types/types";

/**
 * Transform backend CategoryResponse to frontend CategoryDisplay format
 */
export function transformCategory(category: CategoryResponse): CategoryDisplay {
  // Generate slug from Vietnamese name
  const slug = category.tenDanhMuc
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return {
    id: category.categoryid,
    name: category.tenDanhMuc,
    slug,
    level: category.level,
    parentId: category.parentCategoryId,
    parentName: category.parentCategoryName,
    description: category.moTa,
  };
}

/**
 * Build hierarchical category structure (parent -> children)
 */
export function buildCategoryHierarchy(
  parentCategories: CategoryResponse[],
  childCategories: CategoryResponse[]
): CategoryDisplay[] {
  const result: CategoryDisplay[] = [];

  // Transform parent categories
  parentCategories.forEach((parent) => {
    const parentDisplay = transformCategory(parent);
    parentDisplay.subcategories = [];

    // Find and add child categories
    childCategories.forEach((child) => {
      if (child.parentCategoryId === parent.categoryid) {
        const childDisplay = transformCategory(child);
        parentDisplay.subcategories!.push(childDisplay);
      }
    });

    result.push(parentDisplay);
  });

  return result;
}

/**
 * Category API endpoints
 */
export const categoryApi = {
  /**
   * Get categories by level (1 = parent, 2 = child)
   * Note: Backend requires 'level' parameter
   */
  getCategoriesByLevel: async (level: 1 | 2): Promise<CategoryResponse[]> => {
    const response = await api.get<ApiResponse<CategoryResponse[]>>(
      `/categories?level=${level}`
    );
    // Handle both response structures: {data: [...]} or directly [...]
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  /**
   * Get hierarchical categories (parent -> children structure)
   * Fetches both level 1 (parents) and level 2 (children) then combines them
   */
  getCategoryHierarchy: async (): Promise<CategoryDisplay[]> => {
    try {
      // Fetch both levels in parallel
      const [parents, children] = await Promise.all([
        categoryApi.getCategoriesByLevel(1),
        categoryApi.getCategoriesByLevel(2),
      ]);

      return buildCategoryHierarchy(parents, children);
    } catch (error) {
      console.error("Error fetching category hierarchy:", error);
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number): Promise<CategoryResponse> => {
    const response = await api.get<
      CategoryResponse | ApiResponse<CategoryResponse>
    >(`/categories/${id}`);
    // Handle both response structures: direct CategoryResponse or wrapped in ApiResponse
    if ("categoryid" in response.data) {
      return response.data as CategoryResponse;
    }
    return (response.data as ApiResponse<CategoryResponse>).data;
  },

  /**
   * Get all parent categories (level 1)
   */
  getParentCategories: async (): Promise<CategoryResponse[]> => {
    return categoryApi.getCategoriesByLevel(1);
  },

  /**
   * Get all child categories (level 2)
   */
  getChildCategories: async (): Promise<CategoryResponse[]> => {
    return categoryApi.getCategoriesByLevel(2);
  },

  /**
   * Get child categories by parent ID
   * GET /categories?search={parentId}&level=2
   */
  getChildCategoriesByParentId: async (
    parentId: number
  ): Promise<CategoryResponse[]> => {
    const response = await api.get<ApiResponse<CategoryResponse[]>>(
      `/categories?search=${parentId}&level=2`
    );
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  /**
   * POST /categories - Create new category (admin only)
   */
  create: (data: {
    tenDanhMuc: string;
    moTa?: string;
    parentCategoryId?: number;
  }) => api.post<CategoryResponse>("/categories", data),

  /**
   * PATCH /categories/{id} - Update category (admin only)
   */
  update: (id: number, data: { tenDanhMuc?: string; moTa?: string }) =>
    api.patch<CategoryResponse>(`/categories/${id}`, data),

  /**
   * DELETE /categories/{id} - Delete category (admin only)
   */
  delete: (id: number) => api.delete<void>(`/categories/${id}`),
};
