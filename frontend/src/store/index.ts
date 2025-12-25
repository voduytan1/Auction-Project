import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import authReducer, { setCredentials } from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";

// === LISTENER MIDDLEWARE ===
const listenerMiddleware: ListenerMiddlewareInstance =
  createListenerMiddleware();

// 1. HYDRATE STATE FROM LOCALSTORAGE on app startup
listenerMiddleware.startListening({
  predicate: (_, __, previousState) => previousState === undefined,
  effect: async (_action, api) => {
    console.log(
      "[RTK Listener] App startup - hydrating state from localStorage"
    );

    // Restore auth state from localStorage
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log(
          "[RTK Listener] Restoring user from localStorage:",
          user.username
        );
        // Restore user (token sẽ null, sẽ gọi refresh endpoint để lấy access token)
        api.dispatch(
          setCredentials({
            user: user,
            token: null, // Access token không lưu localStorage, sẽ restore qua refresh endpoint
          })
        );
      } catch (error) {
        console.error("[RTK Listener] Failed to restore user:", error);
        localStorage.removeItem("auth_user");
      }
    }
  },
});

// 2. PERSIST USER ONLY (không persist access token) whenever auth changes
listenerMiddleware.startListening({
  predicate: (action) =>
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    action.type.startsWith("auth/") &&
    !action.type.includes("rejected") &&
    !action.type.includes("pending"),
  effect: async (_action, api) => {
    const state = api.getState() as RootState;
    const authState = state.auth;

    // Chỉ lưu user info, KHÔNG lưu access token (access token chỉ lưu trong Redux state)
    if (authState.user) {
      try {
        localStorage.setItem("auth_user", JSON.stringify(authState.user));
        console.log("[RTK Listener] User info persisted to localStorage");
      } catch (error) {
        console.error("[RTK Listener] Failed to persist user:", error);
      }
    }
  },
});

// 3. CLEAR LOCALSTORAGE on logout
listenerMiddleware.startListening({
  predicate: (action) =>
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    action.type.includes("logout"),
  effect: async (_action, api) => {
    const state = api.getState() as RootState;
    // Chỉ clear khi user thực sự logout (state.auth.user = null)
    if (!state.auth.user) {
      console.log("[RTK Listener] Logout detected - clearing storage");

      // Clear auth user from localStorage (token chỉ ở Redux state, không lưu localStorage)
      localStorage.removeItem("auth_user");

      // Close WebSocket connections if any
      try {
        const event = new CustomEvent("auth:logout");
        window.dispatchEvent(event);
      } catch (error) {
        console.warn("Could not dispatch logout event:", error);
      }

      // NOTE: Navigation sẽ được handle bởi useLogout hook (component level)
      // không handle ở middleware để tránh reload trang
    }
  },
});

// 4. AUTO-LOGOUT when token expires (triggered by response interceptor)
// Response interceptor dispatch "auth/logoutUser/fulfilled" khi 401 xảy ra
// Listener này sẽ trigger logout flow (clear storage, etc.)
listenerMiddleware.startListening({
  predicate: (action) =>
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    action.type === "auth/logoutUser/fulfilled",
  effect: async () => {
    console.log("[RTK Listener] Auto-logout triggered by response interceptor");
    // Logout flow đã được handle bởi reducer & listener #3
    // Không cần làm gì thêm ở đây
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Attach store to window for api interceptors
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__REDUX_STORE__ = store;
}
