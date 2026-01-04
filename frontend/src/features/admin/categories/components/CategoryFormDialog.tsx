import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { CategoryResponse, CategoryDisplay } from "@/types/types";

interface CategoryFormData {
  tenDanhMuc: string;
  parentCategoryId?: number;
  moTa?: string;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: CategoryResponse | null;
  isSubmitting: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  parentCategories: CategoryDisplay[];
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  isSubmitting,
  onSubmit,
  parentCategories,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>();

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        reset({
          tenDanhMuc: editingCategory.tenDanhMuc,
          parentCategoryId: editingCategory.parentCategoryId || undefined,
          moTa: editingCategory.moTa || "",
        });
      } else {
        reset({
          tenDanhMuc: "",
          parentCategoryId: undefined,
          moTa: "",
        });
      }
    }
  }, [open, editingCategory, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Chỉnh sửa" : "Thêm"} Danh mục
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Cập nhật thông tin danh mục"
              : "Tạo danh mục mới. Để trống 'Danh mục cha' nếu muốn tạo danh mục cấp 1"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenDanhMuc">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tenDanhMuc"
              {...register("tenDanhMuc", {
                required: "Tên danh mục là bắt buộc",
                maxLength: {
                  value: 100,
                  message: "Tên danh mục không được quá 100 ký tự",
                },
              })}
              placeholder="Nhập tên danh mục"
            />
            {errors.tenDanhMuc && (
              <p className="text-sm text-destructive">
                {errors.tenDanhMuc.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentCategoryId">Danh mục Cha (tuỳ chọn)</Label>
            <Select
              value={watch("parentCategoryId")?.toString() || "none"}
              onValueChange={(value) =>
                setValue(
                  "parentCategoryId",
                  value === "none" ? undefined : parseInt(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha (hoặc để trống cho cấp 1)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không (Danh mục cấp 1)</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Để trống để tạo danh mục cấp 1 (cha). Chọn danh mục để tạo cấp 2
              (con)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moTa">Mô tả (tuỳ chọn)</Label>
            <Textarea
              id="moTa"
              {...register("moTa", {
                maxLength: {
                  value: 500,
                  message: "Mô tả không được quá 500 ký tự",
                },
              })}
              placeholder="Nhập mô tả danh mục"
              rows={3}
            />
            {errors.moTa && (
              <p className="text-sm text-destructive">{errors.moTa.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingCategory ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
