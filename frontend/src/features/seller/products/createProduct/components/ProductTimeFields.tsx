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

interface ProductTimeFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductTimeFields({
  register,
  errors,
}: ProductTimeFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="durationInHours">
        Thời gian đấu giá (giờ) <span className="text-destructive">*</span>
      </Label>
      <Input
        id="durationInHours"
        type="number"
        {...register("durationInHours", {
          required: "Thời gian đấu giá là bắt buộc",
          min: {
            value: 1,
            message: "Thời gian tối thiểu là 1 giờ",
          },
          valueAsNumber: true,
        })}
        placeholder="24"
      />
      <p className="text-xs text-muted-foreground">
        Ví dụ: 24 giờ = 1 ngày, 72 giờ = 3 ngày, 168 giờ = 1 tuần
      </p>
      {errors.durationInHours && (
        <p className="text-sm text-destructive">
          {errors.durationInHours.message}
        </p>
      )}
    </div>
  );
}
