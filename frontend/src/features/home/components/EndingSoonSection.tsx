import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "@/services/product.api";
import { formatPrice } from "../../../lib/format";
import { getTimeRemaining } from "../../../lib/utils";

interface EndingSoonSectionProps {
  products: ProductResponse[];
}

export function EndingSoonSection({ products }: EndingSoonSectionProps) {
  return (
    <section className="relative -mx-4 px-4 py-8 bg-linear-to-r from-red-50 via-orange-50 to-red-50 border-y-2 border-red-200 w-full">
      <div className="px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 max-w-none">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-xl blur-md animate-pulse" />
              <div className="relative p-3 bg-red-500 rounded-xl">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold text-red-600">
                  SẮP KẾT THÚC
                </h2>
                <Badge className="bg-red-500 text-white animate-pulse px-3 py-1">
                  HOT
                </Badge>
              </div>
              <p className="text-red-700 font-medium">
                Nhanh tay đấu giá ngay, cơ hội cuối cùng!
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid - 5 columns, horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="grid grid-cols-5 gap-6 min-w-max md:min-w-full">
            {products.map((product) => (
              <Link
                key={product.productid}
                to={`/products/${product.productid}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full border-2 border-red-200 hover:border-red-400">
                  <div className="aspect-4/3 relative overflow-hidden bg-linear-to-br from-muted to-muted/50">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.tenSanPham}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Badge "Sắp hết hạn" */}
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 text-xs font-bold animate-pulse">
                      SẮP HẾT HẠN
                    </div>
                    {/* Countdown */}
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-red-600 text-white font-bold text-sm px-3 py-1.5 shadow-lg">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(new Date(product.thoiGianKetThuc))}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="font-semibold line-clamp-2 mb-3 group-hover:text-red-600 transition-colors">
                      {product.tenSanPham}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">
                          Giá hiện tại
                        </span>
                        <span className="font-bold text-xl text-red-600">
                          {formatPrice(product.giaHienTai)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {product.tenSeller}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}{" "}
          </div>{" "}
        </div>
      </div>
    </section>
  );
}
