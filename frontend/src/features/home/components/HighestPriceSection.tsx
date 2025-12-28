import type { ProductResponse } from "@/services/product.api";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TrendingUp } from "lucide-react";

interface HighestPriceSectionProps {
  products: ProductResponse[];
}

export function HighestPriceSection({ products }: HighestPriceSectionProps) {
  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="bg-linear-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-linear-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-200">
                <TrendingUp className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Giá Trị Cao
                </h2>
                <p className="text-slate-600 text-sm md:text-base">
                  Những sản phẩm cao cấp, giá trị nhất
                </p>
              </div>
            </div>
            <ProductCarousel products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
