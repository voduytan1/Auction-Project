/**
 * Custom hook for category operations
 */

import { useFetch } from "./use-fetch";
import { categoryApi } from "@/services/category.api";
import type { CategoryDisplay } from "@/types/types";

/**
 * Hook to fetch all categories in hierarchical structure
 *
 * @example
 * ```tsx
 * function CategoryMenu() {
 *   const { data: categories, loading, error } = useCategories();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {categories?.map(cat => (
 *         <li key={cat.id}>
 *           {cat.name}
 *           {cat.subcategories && (
 *             <ul>
 *               {cat.subcategories.map(sub => (
 *                 <li key={sub.id}>{sub.name}</li>
 *               ))}
 *             </ul>
 *           )}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useCategories() {
  return useFetch<CategoryDisplay[]>(() => categoryApi.getCategoryHierarchy(), {
    onSuccess: (data) => {
      console.log("Categories loaded:", data.length);
    },
    onError: (error) => {
      console.error("Failed to load categories:", error);
    },
  });
}
