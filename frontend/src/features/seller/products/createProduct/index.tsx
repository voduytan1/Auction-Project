import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { imageAPI, type CloudinaryUploadResponse } from "@/services/image.api";
import { categoryApi } from "@/services/category.api";
import { productAPI, type CreateProductRequest } from "@/services/product.api";
import type { CategoryDisplay } from "@/types/types";
import { ProductBasicInfoFields } from "./components/ProductBasicInfoFields";
import { ProductCategoryField } from "./components/ProductCategoryField";
import { ProductDescriptionField } from "./components/ProductDescriptionField";
import { ProductImagesField } from "./components/ProductImagesField";
import { ProductPricingFields } from "./components/ProductPricingFields";
import { ProductTimeFields } from "./components/ProductTimeFields";
import { ProductAutoRenewField } from "./components/ProductAutoRenewField";

// Form data matching backend CreateProductRequest
interface ProductFormData {
  tenSanPham: string;
  moTa: string; // moTaChiTiet -> moTa
  giaKhoiDiem: number;
  buocGia: number;
  giaMuaNgay?: number; // Optional buy now price
  categoryId: number; // categoryid -> categoryId
  durationInHours: number; // Replace thoiGianBatDau/KetThuc with duration
  choPhepTuDongGiaHan: boolean; // autoRenew -> choPhepTuDongGiaHan
  choPhepBidderChuaDanhGia: boolean; // New field
}

export function CreateProductForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      choPhepTuDongGiaHan: false,
      choPhepBidderChuaDanhGia: true,
      durationInHours: 24, // Default 1 day
    },
  });

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const hierarchy = await categoryApi.getCategoryHierarchy();

        // Flatten hierarchy to get all categories (parents + children)
        const allCategories: CategoryDisplay[] = [];
        hierarchy.forEach((parent) => {
          allCategories.push(parent);
          if (parent.subcategories) {
            allCategories.push(...parent.subcategories);
          }
        });

        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Không thể tải danh mục!");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleImageSelect = (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setSelectedImages(fileArray);
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return [];

    try {
      const responses = await imageAPI.uploadMultiple(selectedImages);
      const urls = responses.map((res: CloudinaryUploadResponse) => res.url);
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Không thể upload ảnh. Vui lòng thử lại!");
      return [];
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Validate images
      if (selectedImages.length < 3) {
        toast.error("Vui lòng chọn ít nhất 3 ảnh cho sản phẩm!");
        return;
      }
      // Upload images first
      const imageUrls = await handleImageUpload();

      if (imageUrls.length < 3) {
        toast.error("Không thể upload ảnh. Vui lòng thử lại!");
        return;
      }

      // Create product request matching backend DTO
      const productData: CreateProductRequest = {
        tenSanPham: data.tenSanPham,
        moTa: data.moTa,
        giaKhoiDiem: data.giaKhoiDiem,
        buocGia: data.buocGia,
        giaMuaNgay: data.giaMuaNgay,
        categoryId: data.categoryId,
        durationInHours: data.durationInHours,
        images: imageUrls,
        choPhepTuDongGiaHan: data.choPhepTuDongGiaHan,
        choPhepBidderChuaDanhGia: data.choPhepBidderChuaDanhGia,
      };

      // Call API to create product
      await productAPI.create(productData);

      toast.success("Đăng sản phẩm thành công!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng sản phẩm mới</CardTitle>
        <CardDescription>
          Tạo sản phẩm đấu giá mới với thông tin chi tiết
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <ProductBasicInfoFields register={register} errors={errors} />

          <ProductCategoryField
            control={control}
            errors={errors}
            categories={categories}
            isLoading={isLoadingCategories}
          />

          <ProductDescriptionField control={control} errors={errors} />

          <ProductImagesField onImageSelect={handleImageSelect} />

          <ProductPricingFields register={register} errors={errors} />

          <ProductTimeFields register={register} errors={errors} />

          <ProductAutoRenewField control={control} />
          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/seller/products")}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Đăng sản phẩm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
