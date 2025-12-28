import { Flame } from "lucide-react";
import type { ProductResponse } from "@/services/product.api";
import { ProductCarousel } from "@/components/ProductCarousel";

interface MostBidsSectionProps {
  products: ProductResponse[];
}

export function MostBidsSection({ products }: MostBidsSectionProps) {
  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-200">
                <Flame className="h-7 w-7 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Đấu Giá Sôi Động
                </h2>
                <p className="text-slate-600 text-sm md:text-base">
                  Sản phẩm được quan tâm và đấu giá nhiều nhất
                </p>
              </div>
            </div>
            <ProductCarousel products={products} variant="most-bids" />
          </div>
        </div>
      </div>
    </section>
  );
}
