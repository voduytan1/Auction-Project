import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";

interface ProductFormData {
  tenSanPham: string;
  categoryId: number;
  moTa: string;
  giaKhoiDiem: number;
  buocGia: number;
  giaMuaNgay?: number;
  durationInHours: number;
  choPhepTuDongGiaHan: boolean;
  choPhepBidderChuaDanhGia: boolean;
}

interface ProductDescriptionFieldProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductDescriptionField({
  control,
  errors,
}: ProductDescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="moTa">
        Mô tả chi tiết <span className="text-destructive">*</span>
      </Label>

      <Controller
        name="moTa"
        control={control}
        rules={{
          required: "Mô tả chi tiết là bắt buộc",
          validate: (value) => {
            const textOnly = value.replace(/<[^>]*>/g, "").trim();
            if (textOnly.length < 50) {
              return "Mô tả phải có ít nhất 50 ký tự";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <RichTextEditor
            content={field.value || ""}
            onChange={field.onChange}
            placeholder="Nhập mô tả chi tiết về sản phẩm..."
            error={errors.moTa?.message}
          />
        )}
      />

      <p className="text-xs text-muted-foreground">
        Sử dụng các công cụ định dạng để làm nổi bật thông tin quan trọng
      </p>
    </div>
  );
}
