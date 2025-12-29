import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Upload, FileText, Send } from "lucide-react";
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

      // TODO: Backend cần cập nhật để nhận body (lyDo, kiNhangBanHang, etc.)
      // Hiện tại API chỉ dùng JWT token để tạo request
      await userAPI.requestSeller();

      // TODO: Khi backend hỗ trợ body, uncomment và sửa API:
      // await userAPI.requestSeller({
      //   lyDo: data.lyDo,
      //   kiNhangBanHang: data.kiNhangBanHang,
      //   linkMangXaHoi: data.linkMangXaHoi,
      //   soDienThoai: data.soDienThoai
      // });

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

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="lyDo">
                Lý do muốn trở thành Seller{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="lyDo"
                {...register("lyDo", {
                  required: "Vui lòng nhập lý do",
                  minLength: {
                    value: 10,
                    message: "Lý do phải có ít nhất 10 ký tự",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Lý do không được vượt quá 1000 ký tự",
                  },
                })}
                placeholder="Mô tả chi tiết lý do bạn muốn trở thành người bán, kinh nghiệm và kế hoạch kinh doanh của bạn..."
                rows={6}
              />
              {errors.lyDo && (
                <p className="text-sm text-destructive">
                  {errors.lyDo.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Hãy mô tả chi tiết về sản phẩm bạn muốn bán, kinh nghiệm và kế
                hoạch kinh doanh
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="kiNhangBanHang">Kinh nghiệm bán hàng</Label>
              <Textarea
                id="kiNhangBanHang"
                {...register("kiNhangBanHang", {
                  maxLength: {
                    value: 500,
                    message: "Không được vượt quá 500 ký tự",
                  },
                })}
                placeholder="Mô tả kinh nghiệm bán hàng của bạn (nếu có)..."
                rows={4}
              />
              {errors.kiNhangBanHang && (
                <p className="text-sm text-destructive">
                  {errors.kiNhangBanHang.message}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <Label htmlFor="linkMangXaHoi">Link mạng xã hội / Website</Label>
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
                placeholder="https://facebook.com/yourpage hoặc https://yourwebsite.com"
              />
              {errors.linkMangXaHoi && (
                <p className="text-sm text-destructive">
                  {errors.linkMangXaHoi.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Link trang bán hàng, fanpage hoặc website cá nhân (nếu có)
              </p>
            </div>

            {/* Additional Info Alert */}
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Admin sẽ xem xét yêu cầu trong vòng 24-48 giờ</li>
                  <li>
                    Bạn sẽ nhận được thông báo qua email về kết quả xét duyệt
                  </li>
                  <li>
                    Vui lòng cung cấp thông tin chính xác và đầy đủ để tăng cơ
                    hội được chấp thuận
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

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
