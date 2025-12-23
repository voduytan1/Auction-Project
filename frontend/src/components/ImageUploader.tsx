import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  mode: "single" | "multiple";
  onUploadComplete: (files: File | File[]) => void;
  currentImage?: string;
  maxFiles?: number;
  className?: string;
  showConfirmButton?: boolean; // If false, auto-select on file change
}

export function ImageUploader({
  mode,
  onUploadComplete,
  currentImage,
  maxFiles = 5,
  className,
  showConfirmButton = true,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

    // Auto-confirm if showConfirmButton is false
    if (!showConfirmButton) {
      if (mode === "single") {
        onUploadComplete(filesToUse[0]);
      } else {
        onUploadComplete(filesToUse);
      }
      toast.success(
        `Đã chọn ${filesToUse.length} ảnh. Nhấn "Đăng sản phẩm" để upload.`
      );
    }
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

  const handleConfirm = () => {
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    // Just pass files to parent, actual upload happens on form submit
    if (mode === "single") {
      onUploadComplete(selectedFiles[0]);
    } else {
      onUploadComplete(selectedFiles);
    }

    toast.success(`Đã chọn ${selectedFiles.length} ảnh.`);
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
          {showConfirmButton && (
            <div className="flex gap-2 mt-4">
              <Button type="button" onClick={handleConfirm} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Xác nhận
              </Button>
              <Button type="button" onClick={handleCancel} variant="outline">
                Hủy
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Browse Button */}
      {previewUrls.length === 0 && (
        <Button
          type="button"
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
            type="button"
            onClick={handleBrowseClick}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Thêm ảnh khác
          </Button>
        )}
    </div>
  );
}
