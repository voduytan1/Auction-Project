import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface ProductBasicInfoFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductBasicInfoFields({
  register,
  errors,
}: ProductBasicInfoFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tenSanPham">
        Tên sản phẩm <span className="text-destructive">*</span>
      </Label>
      <Input
        id="tenSanPham"
        {...register("tenSanPham", {
          required: "Tên sản phẩm là bắt buộc",
          maxLength: {
            value: 200,
            message: "Tên sản phẩm không được quá 200 ký tự",
          },
        })}
        placeholder="Nhập tên sản phẩm"
      />
      {errors.tenSanPham && (
        <p className="text-sm text-destructive">{errors.tenSanPham.message}</p>
      )}
    </div>
  );
}
