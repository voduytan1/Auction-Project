import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import productReducer from "./slices/productSlice";
// import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // TODO: Add more slices when ready
    // product: productReducer,
    // category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
