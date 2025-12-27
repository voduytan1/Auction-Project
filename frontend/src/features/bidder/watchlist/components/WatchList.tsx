import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useFetch } from "@/hooks/use-fetch";
import { watchlistAPI } from "@/services/watchlist.api";
import { productAPI, type ProductResponse } from "@/services/product.api";

export function WatchList() {
  const navigate = useNavigate();
  const [watchlistProducts, setWatchlistProducts] = useState<ProductResponse[]>(
    []
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch watchlist IDs
  const {
    data: watchlistIds,
    loading: loadingWatchlist,
    error: errorWatchlist,
  } = useFetch(() => watchlistAPI.getWatchlist().then((res) => res.data || []));

  // Fetch full product details for each watchlist item
  useEffect(() => {
    const loadWatchlistProducts = async () => {
      if (
        !watchlistIds ||
        !Array.isArray(watchlistIds) ||
        watchlistIds.length === 0
      ) {
        setWatchlistProducts([]);
        return;
      }

      try {
        const products = await Promise.all(
          watchlistIds.map((productId: number) =>
            productAPI.getById(productId).then((res) => res.data)
          )
        );
        setWatchlistProducts(products.filter(Boolean));
      } catch {
        console.error("Error loading watchlist products");
        toast.error("Lỗi khi tải danh sách yêu thích");
      }
    };

    loadWatchlistProducts();
  }, [watchlistIds]);

  const handleRemoveFromWatchlist = async (productId: number) => {
    try {
      await watchlistAPI.removeFromWatchlist(productId);
      setWatchlistProducts((prev) =>
        prev.filter((p) => p.productid !== productId)
      );
      setDeleteConfirmId(null);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch {
      toast.error("Lỗi khi xóa khỏi danh sách yêu thích");
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

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

    if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
    return `Còn ${hours} giờ`;
  };

  if (loadingWatchlist) {
    return <PageLoader />;
  }

  if (errorWatchlist || watchlistProducts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích
          </p>
          <Button onClick={() => navigate("/")}>Khám phá sản phẩm</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
          <p className="text-muted-foreground">
            {watchlistProducts.length} sản phẩm đang theo dõi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistProducts.map((product) => (
            <Card
              key={product.productid}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.tenSanPham}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {product.tenSanPham}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  {formatTimeLeft(product.thoiGianKetThuc)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá khởi điểm:</span>
                  <span className="font-medium">
                    {formatPrice(product.giaKhoiDiem)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá hiện tại:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(product.giaHienTai)}
                  </span>
                </div>
              </CardContent>
              <div className="px-6 pb-4 gap-2 flex">
                <Button
                  className="flex-1"
                  onClick={() => handleViewProduct(product.productid)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteConfirmId(product.productid)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khỏi danh sách yêu thích</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm khỏi danh sách yêu thích?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirmId && handleRemoveFromWatchlist(deleteConfirmId)
              }
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
