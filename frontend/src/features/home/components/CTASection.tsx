import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="container mx-auto">
      <Card className="relative overflow-hidden border-2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <CardContent className="relative p-12 text-center space-y-6">
          <div className="inline-block">
            <Badge variant="outline" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Tham gia cùng 5,000+ người dùng
            </Badge>
          </div>
          <h2 className="text-4xl font-bold">Sẵn sàng bắt đầu?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đăng ký ngay hôm nay và khám phá hàng ngàn sản phẩm đấu giá với giá
            trị tốt nhất
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/auth/register">
                <Tag className="h-5 w-5 mr-2" />
                Tạo tài khoản miễn phí
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/app/auctions">Khám phá ngay</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
