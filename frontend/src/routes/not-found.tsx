import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-primary">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Không tìm thấy trang
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <a>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </a>
          </Button>
        </div>

        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
            <Link to="/contact" className="text-primary hover:underline">
              liên hệ với chúng tôi
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
