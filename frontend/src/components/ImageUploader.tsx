import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  mode: "single" | "multiple";
  onUploadComplete: (files: File | File[]) => Promise<void>;
  currentImage?: string;
  maxFiles?: number;
  className?: string;
}

export function ImageUploader({
  mode,
  onUploadComplete,
  currentImage,
  maxFiles = 5,
  className,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Validate number of files for multiple mode
    if (mode === "multiple" && validFiles.length > maxFiles) {
      toast.error(`Chỉ được chọn tối đa ${maxFiles} ảnh`);
      return;
    }

    // For single mode, only take the first file
    const filesToUse = mode === "single" ? [validFiles[0]] : validFiles;

    // Create preview URLs
    const newPreviewUrls = filesToUse.map((file) => URL.createObjectURL(file));

    setSelectedFiles(filesToUse);
    setPreviewUrls(newPreviewUrls);
  };

  const handleRemoveImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    // Clean up all preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    setIsUploading(true);
    try {
      // Call the callback with selected files and wait for upload to complete
      // Parent component will handle the actual upload to Cloudinary
      if (mode === "single") {
        await onUploadComplete(selectedFiles[0]);
      } else {
        await onUploadComplete(selectedFiles);
      }

      // Clean up after successful upload
      handleCancel();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={mode === "multiple"}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Current Image (for single mode) */}
      {mode === "single" && currentImage && selectedFiles.length === 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-2">Ảnh hiện tại</p>
          <div className="relative w-full aspect-square max-w-xs mx-auto">
            <img
              src={currentImage}
              alt="Current"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </Card>
      )}

      {/* Preview Section */}
      {previewUrls.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">
            {mode === "single"
              ? "Ảnh đã chọn"
              : `Đã chọn ${previewUrls.length} ảnh`}
          </p>
          <div
            className={cn(
              "grid gap-3",
              mode === "single"
                ? "grid-cols-1 max-w-xs mx-auto"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
          >
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square group overflow-hidden rounded-lg border"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleConfirm}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Xác nhận
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isUploading}
            >
              Hủy
            </Button>
          </div>
        </Card>
      )}

      {/* Browse Button */}
      {previewUrls.length === 0 && (
        <Button
          onClick={handleBrowseClick}
          variant="outline"
          className="w-full h-32 border-dashed"
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {mode === "single"
                ? "Chọn ảnh từ máy"
                : `Chọn tối đa ${maxFiles} ảnh`}
            </span>
          </div>
        </Button>
      )}

      {/* Upload Another (after selecting) */}
      {previewUrls.length > 0 &&
        mode === "multiple" &&
        previewUrls.length < maxFiles && (
          <Button
            onClick={handleBrowseClick}
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Thêm ảnh khác
          </Button>
        )}
    </div>
  );
}
