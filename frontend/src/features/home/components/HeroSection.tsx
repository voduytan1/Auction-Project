import { Button } from "@/components/ui/button";
import { ArrowRight, Gavel, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/use-redux";

export function HeroSection() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Đấu Giá Thông Minh,
              <br />
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Giá Trị Thật
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất. Đấu giá
              minh bạch, an toàn và nhanh chóng.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="gap-2 text-base shadow-lg shadow-primary/25"
                asChild
              >
                <Link to="/search">
                  Khám phá ngay <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base border-2"
                  asChild
                >
                  <Link to="/auth/register">Đăng ký miễn phí</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right - Features */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-shadow">
                <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <Gavel className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  Đấu giá dễ dàng
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tham gia đấu giá chỉ với vài click
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  Giá trị tốt nhất
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sản phẩm chất lượng, giá cạnh tranh
                </p>
              </div>
            </div>
            <div className="pt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  An toàn & Bảo mật
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Giao dịch được bảo vệ 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  );
}
