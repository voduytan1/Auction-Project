import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ProductResponse } from "@/services/product.api";
import { ProductCarousel } from "@/components/ProductCarousel";

interface EndingSoonSectionProps {
  products: ProductResponse[];
}

export function EndingSoonSection({ products }: EndingSoonSectionProps) {
  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-2xl border-2 border-red-200 overflow-hidden shadow-lg">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-xl blur-md animate-pulse" />
                  <div className="relative p-3 bg-red-500 rounded-xl">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-red-600">
                      SẮP KẾT THÚC
                    </h2>
                    <Badge className="bg-red-500 text-white animate-pulse px-3 py-1">
                      HOT
                    </Badge>
                  </div>
                  <p className="text-red-700 font-medium text-sm md:text-base">
                    Nhanh tay đấu giá ngay, cơ hội cuối cùng!
                  </p>
                </div>
              </div>
            </div>

            {/* Product Carousel */}
            <ProductCarousel products={products} variant="ending-soon" />
          </div>
        </div>
      </div>
    </section>
  );
}
