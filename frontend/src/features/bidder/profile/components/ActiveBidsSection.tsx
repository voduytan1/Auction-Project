import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel, Clock, TrendingUp, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";
import { bidAPI } from "@/services/bid.api";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { toast } from "sonner";

export function ActiveBidsSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const fetchActiveBids = async () => {
      try {
        setLoading(true);
        // Get all auto bids
        const autoBidsResponse = await bidAPI.getMyAutoBids();
        const autoBids = autoBidsResponse.data || [];

        if (autoBids.length === 0) {
          setProducts([]);
          return;
        }

        // Fetch product details for each auto bid
        const productIds = autoBids.map((bid: any) => bid.productid);
        const productPromises = productIds.map((id: number) =>
          productAPI.getById(id).then((res) => res.data)
        );

        const productsData = await Promise.all(productPromises);
        // Only show ACTIVE products
        setProducts(productsData.filter((p) => p.trangThai === "ACTIVE"));
      } catch (error) {
        console.error("Error fetching active bids:", error);
        toast.error("Không thể tải danh sách đấu giá");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBids();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  if (loading) {
    return <PageLoader message="Đang tải danh sách đấu giá..." />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Chưa tham gia đấu giá sản phẩm nào</p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product) => (
        <Card
          key={product.productid}
          className="group overflow-hidden hover:shadow-md transition-all duration-200 border-border/60"
        >
          {/* Layout Logic: Flex Col (Mobile) -> Flex Row (Desktop) */}
          <div className="flex flex-col sm:flex-row h-full">
            {/* === PRODUCT IMAGE === */}
            <div
              className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-muted cursor-pointer group-hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/products/${product.productid}`)}
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.tenSanPham}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gavel className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                  Đang tham gia
                </Badge>
              </div>
            </div>

            {/* === PRODUCT DETAILS === */}
            <div className="flex flex-1 flex-col p-4 gap-3">
              {/* Header: Title */}
              <div className="space-y-1">
                <h3
                  className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/products/${product.productid}`)}
                >
                  {product.tenSanPham}
                </h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Người bán: {product.tenSeller}</span>
                </div>
              </div>

              {/* Mobile Divider */}
              <div className="h-px bg-border sm:hidden" />

              {/* Footer: Stats & Action Button */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end mt-auto pt-2">
                {/* Column 1: Price */}
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Giá hiện tại
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(product.giaHienTai)}
                  </p>
                </div>

                {/* Column 2: Time & Bids */}
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeLeft(product.thoiGianKetThuc)}</span>
                  </div>

                  {product.soLuotRaGia !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{product.soLuotRaGia} lượt trả giá</span>
                    </div>
                  )}
                </div>

                {/* Column 3: Action Button */}
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <Button
                    className="w-full sm:w-auto font-semibold"
                    onClick={() => navigate(`/products/${product.productid}`)}
                  >
                    Vào phòng đấu giá
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
