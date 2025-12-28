import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryDisplay, CategoryResponse } from "@/types/types";
import { categoryApi, transformCategory } from "@/services/category.api";
import { toast } from "sonner";

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

interface ProductCategoryFieldProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  categories: CategoryDisplay[]; // Parent categories (level 1)
  isLoading: boolean;
}

export function ProductCategoryField({
  control,
  errors,
  categories,
  isLoading,
}: ProductCategoryFieldProps) {
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [childCategories, setChildCategories] = useState<CategoryDisplay[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  // Load child categories when parent is selected
  useEffect(() => {
    if (!selectedParentId) {
      setChildCategories([]);
      return;
    }

    const loadChildCategories = async () => {
      try {
        setIsLoadingChildren(true);
        const children = await categoryApi.getChildCategoriesByParentId(
          selectedParentId
        );
        // Transform response to CategoryDisplay format
        const transformedChildren = children.map((cat: CategoryResponse) =>
          transformCategory(cat)
        );
        setChildCategories(transformedChildren);
      } catch (error) {
        console.error("Error loading child categories:", error);
        toast.error("Không thể tải danh mục con!");
        setChildCategories([]);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    loadChildCategories();
  }, [selectedParentId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Parent Category Select */}
      <div className="space-y-2">
        <Label htmlFor="parentCategory">
          Danh mục cấp 1 <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedParentId?.toString() || ""}
          onValueChange={(value) => {
            setSelectedParentId(parseInt(value));
            // Reset child category selection when parent changes
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoading ? "Đang tải..." : "Chọn danh mục cấp 1"}
            />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter((cat) => cat.level === 1)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Child Category Select */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">
          Danh mục cấp 2 <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Vui lòng chọn danh mục cấp 2" }}
          render={({ field }) => (
            <Select
              value={field.value?.toString() || ""}
              onValueChange={(value) => field.onChange(parseInt(value))}
              disabled={!selectedParentId || isLoadingChildren}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedParentId
                      ? "Chọn danh mục cấp 1 trước"
                      : isLoadingChildren
                      ? "Đang tải..."
                      : "Chọn danh mục cấp 2"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {childCategories.length === 0 && selectedParentId ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Không có danh mục con
                  </div>
                ) : (
                  childCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>
    </div>
  );
}
