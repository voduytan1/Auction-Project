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

interface ProductPricingFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductPricingFields({
  register,
  errors,
}: ProductPricingFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="giaKhoiDiem">
            Giá khởi điểm (VNĐ) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="giaKhoiDiem"
            type="number"
            {...register("giaKhoiDiem", {
              required: "Giá khởi điểm là bắt buộc",
              min: {
                value: 1000,
                message: "Giá khởi điểm tối thiểu 1,000 VNĐ",
              },
              valueAsNumber: true,
            })}
            placeholder="1000000"
          />
          {errors.giaKhoiDiem && (
            <p className="text-sm text-destructive">
              {errors.giaKhoiDiem.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="buocGia">
            Bước giá (VNĐ) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="buocGia"
            type="number"
            {...register("buocGia", {
              required: "Bước giá là bắt buộc",
              min: { value: 1000, message: "Bước giá tối thiểu 1,000 VNĐ" },
              valueAsNumber: true,
            })}
            placeholder="10000"
          />
          {errors.buocGia && (
            <p className="text-sm text-destructive">{errors.buocGia.message}</p>
          )}
        </div>
      </div>

      {/* Giá mua ngay (optional) */}
      <div className="space-y-2">
        <Label htmlFor="giaMuaNgay">
          Giá mua ngay (VNĐ){" "}
          <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
        </Label>
        <Input
          id="giaMuaNgay"
          type="number"
          {...register("giaMuaNgay", {
            min: {
              value: 1000,
              message: "Giá mua ngay tối thiểu 1,000 VNĐ",
            },
            valueAsNumber: true,
          })}
          placeholder="5000000"
        />
        <p className="text-xs text-muted-foreground">
          Người mua có thể mua luôn sản phẩm với giá này mà không cần đấu giá
        </p>
        {errors.giaMuaNgay && (
          <p className="text-sm text-destructive">
            {errors.giaMuaNgay.message}
          </p>
        )}
      </div>
    </div>
  );
}
