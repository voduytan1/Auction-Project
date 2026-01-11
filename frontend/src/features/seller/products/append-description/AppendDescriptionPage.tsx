import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RichTextEditor } from "@/components/RichTextEditor";
import { PageLoader } from "@/components/PageLoader";
import { toast } from "sonner";
import { productAPI, type ProductResponse } from "@/services/product.api";

interface AppendFormData {
  noiDungThem: string;
}

export default function AppendDescriptionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppendFormData>({
    defaultValues: {
      noiDungThem: "",
    },
  });

  // Load product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Không thể tải thông tin sản phẩm!");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const onSubmit = async (data: AppendFormData) => {
    if (!id) return;

    try {
      setIsSubmitting(true);

      await productAPI.appendDescription(id, data.noiDungThem);

      toast.success("Đã bổ sung mô tả thành công!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error appending description:", error);
      toast.error("Không thể bổ sung mô tả. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Đang tải thông tin sản phẩm..." />;
  }

  if (!product) {
    return (
      <PageWrapper title="Không tìm thấy sản phẩm">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center text-red-500">
              Không tìm thấy sản phẩm
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Bổ sung mô tả - ${product.tenSanPham}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/seller/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bổ sung mô tả sản phẩm</h1>
            <p className="text-muted-foreground mt-1">{product.tenSanPham}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Current Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mô tả hiện tại
              </CardTitle>
              <CardDescription>
                Nội dung mô tả đang hiển thị cho sản phẩm này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-4 max-h-150 overflow-y-auto">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.moTa }}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Additional Description */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bổ sung</CardTitle>
              <CardDescription>
                Thêm thông tin bổ sung vào cuối mô tả hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="noiDungThem">
                  Nội dung bổ sung <span className="text-destructive">*</span>
                </Label>

                <Controller
                  name="noiDungThem"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập nội dung bổ sung",
                    validate: (value) => {
                      const textOnly = value.replace(/<[^>]*>/g, "").trim();
                      if (textOnly.length < 10) {
                        return "Nội dung phải có ít nhất 10 ký tự";
                      }
                      if (textOnly.length > 1000) {
                        return "Nội dung không được quá 1000 ký tự";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Nhập thông tin bổ sung về sản phẩm..."
                      error={errors.noiDungThem?.message}
                    />
                  )}
                />

                <p className="text-xs text-muted-foreground">
                  Sử dụng các công cụ định dạng để làm nổi bật thông tin quan
                  trọng
                </p>
              </div>

              {/* Info Alert */}
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Nội dung bổ sung sẽ được thêm vào cuối mô tả hiện tại và không
                  thể xóa. Lịch sử bổ sung sẽ được lưu lại để theo dõi.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/seller/products")}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang xử lý..." : "Bổ sung mô tả"}
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
