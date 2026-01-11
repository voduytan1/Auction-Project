import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { AppStore } from "@/store";
import type { RefreshTokenResponse } from "@/features/auth/types";
import { env } from "@/config/env";
import { rateLimitManager } from "./rate-limit";

// Flag to prevent multiple rate limit triggers
let rateLimitTriggered = false;

// Refresh token state - prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Declare window.__REDUX_STORE__ type
declare global {
  interface Window {
    __REDUX_STORE__?: AppStore;
  }
}

// Create axios instance
const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true, // Enable cookies for CORS
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = window.__REDUX_STORE__;
    const accessToken = store?.getState()?.auth?.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend trả về dạng ApiResponse<T> = { data: T, metadata, message, success }
    // Preserve metadata khi extract data
    if (response.data?.data !== undefined) {
      const originalData = response.data;
      return {
        ...response,
        data: originalData.data,
        // Preserve metadata in custom property
        __metadata__: originalData.metadata,
        __raw__: originalData,
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu là request login hoặc public endpoints (product detail) bị 401 thì trả lỗi về cho component xử lý, không redirect
    const isPublicEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.match(/\/products\/\d+$/); // GET /products/{id}

    if (error.response?.status === 401 && isPublicEndpoint) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired (các request khác)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log("[API] Access token expired, attempting refresh...");

      try {
        // Refresh token - BE sẽ đọc refresh_token từ cookie
        const response = await axios.post<{ data: RefreshTokenResponse }>(
          `${env.API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Gửi cookie
          }
        );

        console.log("[API] Refresh successful!");

        const refreshData = response.data.data;
        const { accessToken, ...userData } = refreshData;

        // RefreshTokenResponse already matches User interface
        // No need to transform field names
        const user = userData;

        // Dispatch action to update token + user in Redux
        const store = window.__REDUX_STORE__;
        if (store) {
          store.dispatch({
            type: "auth/setCredentials",
            payload: { user, accessToken },
          });
        }

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("[API] Refresh failed:", refreshError);

        // Process queued requests with error
        processQueue(refreshError, null);
        isRefreshing = false;

        // Dispatch logout action
        const store = window.__REDUX_STORE__;
        if (store) {
          store.dispatch({ type: "auth/clearAuth" });
        }

        // Reject với custom error để component tự navigate (tránh reload)
        const authError = new Error("SESSION_EXPIRED") as AxiosError;
        authError.response = error.response;
        return Promise.reject(authError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
      // Optionally redirect to unauthorized page
      // window.location.href = "/unauthorized";
    }

    // Handle 429 Too Many Requests (Rate Limit)
    if (error.response?.status === 429) {
      // Only trigger once to avoid multiple modals
      if (!rateLimitTriggered) {
        rateLimitTriggered = true;
        rateLimitManager.trigger();

        // Reset flag after 1 minute
        setTimeout(() => {
          rateLimitTriggered = false;
        }, 60000);
      }

      const rateLimitError = new Error(
        "Quá nhiều yêu cầu. Vui lòng chờ 1 phút."
      ) as AxiosError;
      rateLimitError.response = error.response;
      return Promise.reject(rateLimitError);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Internal server error");
    }

    // Extract error message from backend response
    if (error.response?.data) {
      const data = error.response.data as { message?: string; error?: string };
      const backendMessage = data.message || data.error;
      if (backendMessage) {
        const customError = new Error(backendMessage) as AxiosError;
        customError.response = error.response;
        customError.config = error.config;
        return Promise.reject(customError);
      }
    }

    return Promise.reject(error);
  }
);

// Export API instance
export default api;

// Export helper types
export type { AxiosError, AxiosResponse };
