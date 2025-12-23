import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface WatchListProduct {
  id: string;
  tenSanPham: string;
  hinhAnh: string;
  giaKhoiDiem: number;
  giaHienTai: number;
  soLuotDauGia: number;
  thoiGianKetThuc: string;
  trangThai: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export function WatchList() {
  // Mock data for watchlist
  const mockWatchList: WatchListProduct[] = [
    {
      id: "1",
      tenSanPham: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
      hinhAnh:
        "https://images.unsplash.com/photo-1696446702183-cbd50c06e3e6?w=500",
      giaKhoiDiem: 25000000,
      giaHienTai: 28500000,
      soLuotDauGia: 12,
      thoiGianKetThuc: "2024-12-25T18:00:00",
      trangThai: "ACTIVE",
    },
    {
      id: "2",
      tenSanPham: "MacBook Pro M3 14 inch - Space Black",
      hinhAnh:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      giaKhoiDiem: 35000000,
      giaHienTai: 37200000,
      soLuotDauGia: 8,
      thoiGianKetThuc: "2024-12-26T20:00:00",
      trangThai: "ACTIVE",
    },
    {
      id: "3",
      tenSanPham: "Sony WH-1000XM5 - Tai nghe chống ồn cao cấp",
      hinhAnh:
        "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500",
      giaKhoiDiem: 5000000,
      giaHienTai: 5500000,
      soLuotDauGia: 15,
      thoiGianKetThuc: "2024-12-24T22:00:00",
      trangThai: "ACTIVE",
    },
    {
      id: "4",
      tenSanPham: "Samsung Galaxy Watch 6 Classic",
      hinhAnh:
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
      giaKhoiDiem: 6000000,
      giaHienTai: 6800000,
      soLuotDauGia: 10,
      thoiGianKetThuc: "2024-12-27T16:00:00",
      trangThai: "ACTIVE",
    },
  ];

  const [watchList] = useState<WatchListProduct[]>(mockWatchList);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<WatchListProduct | null>(null);

  // TODO: Fetch watchlist from API
  // useEffect(() => {
  //   const fetchWatchList = async () => {
  //     const data = await watchlistApi.getWatchList();
  //     setWatchList(data);
  //   };
  //   fetchWatchList();
  // }, []);

  const navigate = useNavigate();

  const handleRemoveFromWatchList = (product: WatchListProduct) => {
    setSelectedProduct(product);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!selectedProduct) return;

    try {
      // TODO: Call API to remove from watchlist
      // await watchlistApi.removeFromWatchList(selectedProduct.id);
      toast.success("Đã xóa khỏi danh sách yêu thích!");
      setRemoveDialogOpen(false);
      setSelectedProduct(null);
      // Refresh watchlist
    } catch {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleViewProduct = (productId: string) => {
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

  if (watchList.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích
          </p>
          <Button onClick={() => (window.location.href = "/products")}>
            Khám phá sản phẩm
          </Button>
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
            {watchList.length} sản phẩm đang theo dõi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchList.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={product.hinhAnh || "/placeholder.jpg"}
                  alt={product.tenSanPham}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={
                    product.trangThai === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {product.trangThai === "ACTIVE"
                    ? "Đang đấu giá"
                    : "Đã kết thúc"}
                </Badge>
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số lượt đấu:</span>
                  <span className="font-medium">{product.soLuotDauGia}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveFromWatchList(product)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khỏi danh sách yêu thích</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa "{selectedProduct?.tenSanPham}" khỏi
              danh sách yêu thích?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
