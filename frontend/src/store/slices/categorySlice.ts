import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CategoryDisplay } from "@/types/types";
import { categoryApi } from "@/services/category.api";

// Async thunk - Fetch categories hierarchy
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoryApi.getCategoryHierarchy();
      return categories;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh mục"
      );
    }
  }
);

// State interface
interface CategoryState {
  categories: CategoryDisplay[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp để cache
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryDisplay[]>) => {
          state.isLoading = false;
          state.categories = action.payload;
          state.lastFetched = Date.now();
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectCategories = (state: { category: CategoryState }) =>
  state.category.categories;

export const selectCategoriesLoading = (state: { category: CategoryState }) =>
  state.category.isLoading;

export const selectCategoriesError = (state: { category: CategoryState }) =>
  state.category.error;

// Helper selector: Check if cache is still valid
export const selectIsCacheValid = (state: { category: CategoryState }) => {
  if (!state.category.lastFetched) return false;
  return Date.now() - state.category.lastFetched < CACHE_DURATION;
};

// Helper selector: Get categories by parent slug
export const selectCategoriesByParentSlug =
  (parentSlug: string) => (state: { category: CategoryState }) => {
    return state.category.categories.find((cat) => cat.slug === parentSlug);
  };

export const { clearError, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
