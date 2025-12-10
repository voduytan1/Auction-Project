import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../features/products/types";

export interface ProductListState {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  sortBy: "endTime" | "price" | "newest";
  sortOrder: "asc" | "desc";
}

interface ProductState {
  list: ProductListState;
  detail: Product | null;
  watchList: string[];
  myBids: Product[];
  myProducts: Product[];
  topEnding: Product[];
  topPrice: Product[];
  topBids: Product[];
}

const initialState: ProductState = {
  list: {
    products: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 12,
    sortBy: "endTime",
    sortOrder: "desc",
  },
  detail: null,
  watchList: JSON.parse(localStorage.getItem("watchList") || "[]"),
  myBids: [],
  myProducts: [],
  topEnding: [],
  topPrice: [],
  topBids: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{ products: Product[]; total: number }>
    ) => {
      state.list.products = action.payload.products;
      state.list.total = action.payload.total;
      state.list.loading = false;
    },
    setProductDetail: (state, action: PayloadAction<Product | null>) => {
      state.detail = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.list.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.list.error = action.payload;
      state.list.loading = false;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.list.page = action.payload;
    },
    setSorting: (
      state,
      action: PayloadAction<{
        sortBy: "endTime" | "price" | "newest";
        sortOrder: "asc" | "desc";
      }>
    ) => {
      state.list.sortBy = action.payload.sortBy;
      state.list.sortOrder = action.payload.sortOrder;
    },
    addToWatchList: (state, action: PayloadAction<string>) => {
      if (!state.watchList.includes(action.payload)) {
        state.watchList.push(action.payload);
        localStorage.setItem("watchList", JSON.stringify(state.watchList));
      }
    },
    removeFromWatchList: (state, action: PayloadAction<string>) => {
      state.watchList = state.watchList.filter((id) => id !== action.payload);
      localStorage.setItem("watchList", JSON.stringify(state.watchList));
    },
    setTopProducts: (
      state,
      action: PayloadAction<{
        topEnding?: Product[];
        topPrice?: Product[];
        topBids?: Product[];
      }>
    ) => {
      if (action.payload.topEnding) state.topEnding = action.payload.topEnding;
      if (action.payload.topPrice) state.topPrice = action.payload.topPrice;
      if (action.payload.topBids) state.topBids = action.payload.topBids;
    },
    updateProductPrice: (
      state,
      action: PayloadAction<{
        productId: string;
        newPrice: number;
        bidCount: number;
      }>
    ) => {
      const { productId, newPrice, bidCount } = action.payload;

      // Update in list
      const productInList = state.list.products.find((p) => p.id === productId);
      if (productInList) {
        productInList.currentPrice = newPrice;
        productInList.bidCount = bidCount;
      }

      // Update detail if it's the same product
      if (state.detail?.id === productId) {
        state.detail.currentPrice = newPrice;
        state.detail.bidCount = bidCount;
      }
    },
  },
});

export const {
  setProducts,
  setProductDetail,
  setLoading,
  setError,
  setPage,
  setSorting,
  addToWatchList,
  removeFromWatchList,
  setTopProducts,
  updateProductPrice,
} = productSlice.actions;

export default productSlice.reducer;
