import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TrendingUp, FileText, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { userAPI } from "@/services/user.api";

interface UpgradeRequestFormData {
  lyDo: string;
  kiNhangBanHang?: string;
  linkMangXaHoi?: string;
}

export function UpgradeToSellerRequest() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpgradeRequestFormData>();

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Backend không cần body, chỉ dùng JWT token
      await userAPI.requestSeller();

      toast.success("Yêu cầu nâng cấp đã được gửi thành công!");
      toast.info("Admin sẽ xem xét và phản hồi trong vòng 24-48 giờ", {
        duration: 5000,
      });

      navigate("/bidder/profile");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 max-w-3xl">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            Yêu cầu nâng cấp tài khoản Seller
          </CardTitle>
          <CardDescription className="text-sm">
            Điền thông tin để trở thành người bán trên nền tảng
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Information Alert */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">
                  Quyền lợi khi trở thành Seller:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Đăng bán sản phẩm không giới hạn</li>
                  <li>Quản lý đấu giá và giao dịch</li>
                  <li>Nhận thanh toán trực tiếp</li>
                  <li>Hỗ trợ ưu tiên từ admin</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Experience - Optional */}
            <div className="space-y-2">
              <Label htmlFor="kiNhangBanHang">
                Kinh nghiệm bán hàng (tùy chọn)
              </Label>
              <Textarea
                id="kiNhangBanHang"
                {...register("kiNhangBanHang", {
                  maxLength: {
                    value: 500,
                    message: "Không được vượt quá 500 ký tự",
                  },
                })}
                placeholder="Mô tả ngắn gọn kinh nghiệm bán hàng của bạn..."
                rows={3}
              />
              {errors.kiNhangBanHang && (
                <p className="text-sm text-destructive">
                  {errors.kiNhangBanHang.message}
                </p>
              )}
            </div>

            {/* Social Links - Optional */}
            <div className="space-y-2">
              <Label htmlFor="linkMangXaHoi">
                Link mạng xã hội / Website (tùy chọn)
              </Label>
              <Input
                id="linkMangXaHoi"
                type="url"
                {...register("linkMangXaHoi", {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                      "Link không hợp lệ (phải bắt đầu bằng http:// hoặc https://)",
                  },
                })}
                placeholder="https://facebook.com/yourpage"
              />
              {errors.linkMangXaHoi && (
                <p className="text-sm text-destructive">
                  {errors.linkMangXaHoi.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/bidder/profile")}
                disabled={isSubmitting}
                className="w-full sm:flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1"
              >
                {isSubmitting ? (
                  "Đang gửi..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi yêu cầu
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
