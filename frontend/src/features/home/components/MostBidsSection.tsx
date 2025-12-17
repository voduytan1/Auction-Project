import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface MostBidsSectionProps {
  products: Product[];
}

export function MostBidsSection({ products }: MostBidsSectionProps) {
  return (
    <section className="container mx-auto">
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
        <Button variant="ghost" asChild className="hidden md:flex">
          <Link to="/app/auctions">
            Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
