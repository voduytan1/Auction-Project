import api from "./api";

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  height: number;
  width: number;
  bytes: number;
}

/**
 * Image Upload API endpoints
 */
export const imageAPI = {
  /**
   * Upload single image
   * @param file - Image file to upload
   * @returns Cloudinary upload response with URL and metadata
   */
  uploadSingle: async (file: File): Promise<CloudinaryUploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<CloudinaryUploadResponse>(
      "/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Upload multiple images
   * @param files - Array of image files to upload
   * @returns Array of Cloudinary upload responses
   */
  uploadMultiple: async (
    files: File[]
  ): Promise<CloudinaryUploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post<CloudinaryUploadResponse[]>(
      "/images/upload-multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
