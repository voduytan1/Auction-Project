import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true, // Enable cookies for CORS
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Add auth token when Redux slices are ready
    // const state = store.getState();
    // const token = state.auth?.accessToken;
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Backend trả về dạng ApiResponse<T> = { data: T, message, success }
    // Extract data để dễ sử dụng
    if (response.data?.data !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu là request login mà bị 401 thì trả lỗi về cho component xử lý, không redirect
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired (các request khác)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy user từ state để refresh token
        const userId = localStorage.getItem("userId");

        if (!userId) {
          localStorage.removeItem("accessToken");
          // Chỉ redirect nếu không đang ở trang login
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
          return Promise.reject(error);
        }

        // Refresh token - BE sẽ đọc refresh_token từ cookie
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh/${userId}`,
          {},
          {
            withCredentials: true, // Gửi cookie
          }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
      // Optionally redirect to unauthorized page
      // window.location.href = "/unauthorized";
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Internal server error");
    }

    return Promise.reject(error);
  }
);

// Export API instance
export default api;

// Export helper types
export type { AxiosError, AxiosResponse };
