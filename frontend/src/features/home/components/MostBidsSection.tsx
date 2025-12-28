import { Flame } from "lucide-react";
import type { ProductResponse } from "@/services/product.api";
import { ProductCard } from "./ProductCard";

interface MostBidsSectionProps {
  products: ProductResponse[];
}

export function MostBidsSection({ products }: MostBidsSectionProps) {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <Flame className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Đấu Giá Sôi Động</h2>
            <p className="text-muted-foreground">
              Sản phẩm được quan tâm và đấu giá nhiều nhất
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
