import type { AxiosError, AxiosResponse } from "axios";
import type { ApiErrorResponse } from "@/types";

/**
 * Generic API helper functions
 */
export const apiHelpers = {
  /**
   * Handle API errors consistently
   */
  handleError: (error: unknown): ApiErrorResponse => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response) {
        // Server responded with error
        return {
          message: axiosError.response.data?.message || "An error occurred",
          status: axiosError.response.status,
          data: axiosError.response.data,
        };
      }
      if (axiosError.request) {
        // Request made but no response
        return {
          message: "No response from server",
          status: 0,
          data: null,
        };
      }
    }
    // Error in request setup
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      status: 0,
      data: null,
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
