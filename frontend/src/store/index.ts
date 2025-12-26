import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import type { TypedStartListening } from "@reduxjs/toolkit";
import authReducer, { logoutUser } from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";

// === 1. ĐỊNH NGHĨA REDUCER VÀ TYPE TRƯỚC (Phá vòng lặp Circular Dependency) ===
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
});

// Định nghĩa RootState dựa trên reducer, KHÔNG dựa trên store
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

// === 2. CẤU HÌNH LISTENER MIDDLEWARE VỚI TYPE CHUẨN ===
const listenerMiddleware = createListenerMiddleware();

// Tạo hàm startListening có định kiểu sẵn để dùng cho an toàn
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startListening =
  listenerMiddleware.startListening as AppStartListening;

// === CÁC EFFECTS ===

// Effect A: PERSIST USER (Lưu user info khi auth action fulfilled)
startListening({
  predicate: (action) => {
    return (
      typeof action.type === "string" &&
      action.type.startsWith("auth/") &&
      action.type.endsWith("/fulfilled")
    );
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();

    if (state.auth.user) {
      try {
        localStorage.setItem("auth_user", JSON.stringify(state.auth.user));
        console.log("[RTK Listener] User persisted to localStorage");
      } catch (error) {
        console.error("[RTK Listener] Failed to persist user:", error);
      }
    }
  },
});

// Effect B: CLEANUP (Xóa storage khi logout)
startListening({
  actionCreator: logoutUser.fulfilled,
  effect: async () => {
    console.log("[RTK Listener] Logout detected - Cleaning storage");
    localStorage.removeItem("auth_user");

    // Dispatch event để các tab khác (nếu có) biết mà logout theo
    try {
      const event = new CustomEvent("auth:logout");
      window.dispatchEvent(event);
    } catch (error) {
      console.warn("Could not dispatch logout event:", error);
    }
  },
});

// === 3. TẠO STORE ===
const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Tắt check này cho đỡ warning
      }).prepend(listenerMiddleware.middleware),
  });
};

export const store = makeStore();
export type AppStore = typeof store;

// Attach store to window for api interceptors (Debug only)
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__REDUX_STORE__ = store;
}
