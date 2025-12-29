import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { AppStore } from "@/store";
import { env } from "@/config/env";

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

    console.log("🔑 Access Token:", accessToken);
    console.log("📡 Request URL:", config.url);
    console.log("📝 Request Method:", config.method?.toUpperCase());

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
        // Refresh token - BE sẽ đọc refresh_token từ cookie
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Gửi cookie
          }
        );

        const refreshData = response.data.data;
        const { accessToken } = refreshData;

        // Transform to User object
        const user = {
          userid: refreshData.userid,
          username: refreshData.username,
          email: refreshData.email,
          vaitro: refreshData.vaitro,
          thoiHanBanHang: refreshData.thoiHanBanHang,
          hoVaTen: refreshData.hoVaTen,
          diaChi: refreshData.diaChi,
          soDienThoai: refreshData.soDienThoai,
          ngaySinh: refreshData.ngaySinh,
          diemDanhGia: refreshData.diemDanhGia,
          soLuotDanhGia: refreshData.soLuongDanhGia,
          anhDaiDien: refreshData.anhDaiDien,
          tyLeDanhGiaTot: 85, // Default
        };

        // Dispatch action to update token + user in Redux
        const store = window.__REDUX_STORE__;
        if (store) {
          store.dispatch({
            type: "auth/setCredentials",
            payload: { user, accessToken },
          });
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Dispatch logout action
        const store = window.__REDUX_STORE__;
        if (store) {
          store.dispatch({ type: "auth/clearAuth" });
        }

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
