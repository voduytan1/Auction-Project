import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
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
      <div className="flex items-center justify-between space-x-2">
        <Label
          htmlFor="choPhepTuDongGiaHan"
          className="text-sm font-normal cursor-pointer flex-1"
        >
          Tự động gia hạn nếu không có người đấu giá
        </Label>
        <Controller
          name="choPhepTuDongGiaHan"
          control={control}
          render={({ field }) => (
            <Switch
              id="choPhepTuDongGiaHan"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="cursor-pointer"
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label
          htmlFor="choPhepBidderChuaDanhGia"
          className="text-sm font-normal cursor-pointer flex-1"
        >
          Cho phép bidder chưa được đánh giá tham gia đấu giá
        </Label>
        <Controller
          name="choPhepBidderChuaDanhGia"
          control={control}
          render={({ field }) => (
            <Switch
              id="choPhepBidderChuaDanhGia"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="cursor-pointer"
            />
          )}
        />
      </div>
    </div>
  );
}
