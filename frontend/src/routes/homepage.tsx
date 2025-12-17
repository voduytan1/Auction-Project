import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Gavel, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Sàn Đấu Giá Trực Tuyến
          <span className="block text-primary mt-2">Uy Tín & Minh Bạch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Mua bán sản phẩm thông qua đấu giá công khai, giá trị thực, cơ hội cho
          mọi người
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/app/auctions">
              Khám phá đấu giá <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth/register">Đăng ký ngay</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <Gavel className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Đấu Giá Công Khai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hệ thống đấu giá minh bạch, mọi thông tin được cập nhật thời gian
              thực
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>An Toàn & Bảo Mật</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Xác thực người dùng, hệ thống đánh giá uy tín, thanh toán được bảo
              vệ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Giá Trị Tốt Nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Đặt giá tự động, gia hạn thông minh, cơ hội mua với giá tốt nhất
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="bg-muted/50 rounded-lg p-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <div className="text-muted-foreground mt-2">Sản phẩm đấu giá</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">5,000+</div>
            <div className="text-muted-foreground mt-2">Người dùng</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">98%</div>
            <div className="text-muted-foreground mt-2">Tỷ lệ hài lòng</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground mt-2">Hỗ trợ</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 bg-primary/5 rounded-lg p-12">
        <h2 className="text-3xl font-bold">Sẵn sàng bắt đầu?</h2>
        <p className="text-muted-foreground">
          Đăng ký ngay hôm nay và khám phá hàng ngàn sản phẩm đấu giá
        </p>
        <Button size="lg" asChild>
          <Link to="/auth/register">Tạo tài khoản miễn phí</Link>
        </Button>
      </section>
    </div>
  );
}

export default HomePage;
