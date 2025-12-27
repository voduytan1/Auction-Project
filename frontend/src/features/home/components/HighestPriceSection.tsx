import type { ProductResponse } from "@/services/product.api";
import { ProductCard } from "./ProductCard";
import { TrendingUp } from "lucide-react";

interface HighestPriceSectionProps {
  products: ProductResponse[];
}

export function HighestPriceSection({ products }: HighestPriceSectionProps) {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <TrendingUp className="h-7 w-7 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Giá Trị Cao</h2>
            <p className="text-muted-foreground">
              Những sản phẩm cao cấp, giá trị nhất
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="grid grid-cols-5 gap-6 min-w-max md:min-w-full">
          {products.map((product) => (
            <ProductCard key={product.productid} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
