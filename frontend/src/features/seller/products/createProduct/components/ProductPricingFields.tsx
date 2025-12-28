import type { FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
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
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

// Format number with comma separator
const formatNumber = (value: number | string | undefined): string => {
  if (!value) return "";
  const numValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(numValue)) return "";
  return numValue.toLocaleString("en-US");
};

// Parse formatted string to number
const parseNumber = (value: string): number | undefined => {
  if (!value) return undefined;
  const numValue = parseFloat(value.replace(/,/g, ""));
  return isNaN(numValue) ? undefined : numValue;
};

export function ProductPricingFields({
  control,
  errors,
}: ProductPricingFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="giaKhoiDiem">
            Giá khởi điểm (VNĐ) <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="giaKhoiDiem"
            control={control}
            rules={{
              required: "Giá khởi điểm là bắt buộc",
              min: {
                value: 1000,
                message: "Giá khởi điểm tối thiểu 1,000 VNĐ",
              },
            }}
            render={({ field }) => (
              <Input
                id="giaKhoiDiem"
                type="text"
                value={formatNumber(field.value)}
                onChange={(e) => {
                  const numValue = parseNumber(e.target.value);
                  field.onChange(numValue);
                }}
                onBlur={field.onBlur}
                placeholder="1,000,000"
              />
            )}
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
          <Controller
            name="buocGia"
            control={control}
            rules={{
              required: "Bước giá là bắt buộc",
              min: { value: 1000, message: "Bước giá tối thiểu 1,000 VNĐ" },
            }}
            render={({ field }) => (
              <Input
                id="buocGia"
                type="text"
                value={formatNumber(field.value)}
                onChange={(e) => {
                  const numValue = parseNumber(e.target.value);
                  field.onChange(numValue);
                }}
                onBlur={field.onBlur}
                placeholder="10,000"
              />
            )}
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
        <Controller
          name="giaMuaNgay"
          control={control}
          rules={{
            min: {
              value: 1000,
              message: "Giá mua ngay tối thiểu 1,000 VNĐ",
            },
          }}
          render={({ field }) => (
            <Input
              id="giaMuaNgay"
              type="text"
              value={formatNumber(field.value)}
              onChange={(e) => {
                const numValue = parseNumber(e.target.value);
                field.onChange(numValue);
              }}
              onBlur={field.onBlur}
              placeholder="5,000,000"
            />
          )}
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
