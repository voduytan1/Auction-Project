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
    const response = await api.get<ApiResponse<CategoryResponse>>(
      `/categories/${id}`
    );
    // Handle both response structures
    return (response.data as any).categoryid
      ? response.data
      : response.data.data;
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
};
