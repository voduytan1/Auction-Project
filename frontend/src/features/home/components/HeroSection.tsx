import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 text-white py-20 md:py-24">
      <div className="container mx-auto px-4 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Nền tảng đấu giá trực tuyến
        </h1>
        <p className="text-base md:text-lg opacity-85 max-w-2xl mx-auto">
          Hàng ngàn sản phẩm – Giá khởi điểm hấp dẫn
        </p>
        <div className="pt-4">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-8"
            asChild
          >
            <Link to="/app/auctions">Khám phá ngay</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
