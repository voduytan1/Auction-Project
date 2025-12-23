import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
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

interface ProductAutoRenewFieldProps {
  control: Control<ProductFormData>;
}

export function ProductAutoRenewField({ control }: ProductAutoRenewFieldProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center space-x-2">
        <Controller
          name="choPhepTuDongGiaHan"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="choPhepTuDongGiaHan"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label
          htmlFor="choPhepTuDongGiaHan"
          className="text-sm font-normal cursor-pointer"
        >
          Tự động gia hạn nếu không có người đấu giá
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="choPhepBidderChuaDanhGia"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="choPhepBidderChuaDanhGia"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label
          htmlFor="choPhepBidderChuaDanhGia"
          className="text-sm font-normal cursor-pointer"
        >
          Cho phép bidder chưa được đánh giá tham gia đấu giá
        </Label>
      </div>
    </div>
  );
}
