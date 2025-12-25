import type { AxiosError, AxiosResponse } from "axios";
import type { ApiErrorResponse } from "@/types/types";

/**
 * Generic API helper functions
 */
export const apiHelpers = {
  /**
   * Handle API errors consistently
   */
  handleError: (error: unknown): ApiErrorResponse => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Server responded with error - backend returns { error, message, path, status, timestamp }
        const backendError = axiosError.response.data as ApiErrorResponse;
        if (
          backendError &&
          typeof backendError === "object" &&
          "error" in backendError
        ) {
          return backendError;
        }
        // Fallback if not in expected format
        return {
          error: "Server Error",
          message:
            (axiosError.response.data as any)?.message || "An error occurred",
          path: null,
          status: axiosError.response.status,
          timestamp: new Date().toISOString(),
        };
      }
      if (axiosError.request) {
        // Request made but no response
        return {
          error: "Network Error",
          message: "No response from server",
          path: null,
          status: 0,
          timestamp: new Date().toISOString(),
        };
      }
    }
    // Error in request setup
    return {
      error: "Request Error",
      message: error instanceof Error ? error.message : "An error occurred",
      path: null,
      status: 0,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Extract data from response
   */
  extractData: <T>(response: AxiosResponse<T>): T => {
    return response.data;
  },

  /**
   * Check if error is axios error
   */
  isAxiosError: (error: unknown): error is AxiosError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "isAxiosError" in error &&
      error.isAxiosError === true
    );
  },

  /**
   * Get error message from error object
   */
  getErrorMessage: (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      if ("response" in error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.data?.message) {
          return axiosError.response.data.message;
        }
      }
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
    return "An unexpected error occurred";
  },
};
