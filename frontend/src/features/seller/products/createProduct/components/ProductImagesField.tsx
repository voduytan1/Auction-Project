import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ImageUploader";

interface ProductImagesFieldProps {
  onImageSelect: (files: File | File[]) => void;
}

export function ProductImagesField({ onImageSelect }: ProductImagesFieldProps) {
  const handleImageSelect = (files: File | File[]) => {
    onImageSelect(files);
  };

  return (
    <div className="space-y-2">
      <Label>
        Hình ảnh sản phẩm <span className="text-destructive">*</span>
      </Label>
      <ImageUploader
        mode="multiple"
        onUploadComplete={handleImageSelect}
        maxFiles={10}
        showConfirmButton={false}
      />
      <p className="text-xs text-muted-foreground">
        Chọn tối thiểu 3 ảnh, tối đa 10 ảnh.
      </p>
    </div>
  );
}
