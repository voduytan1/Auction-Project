import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  FileText,
  MoreVertical,
  Clock,
  Gavel,
  Tag,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { SimplePagination } from "@/components/SimplePagination";
import { useAppSelector } from "@/hooks/use-redux";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductsTableProps {
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export function ProductsTable({ status }: ProductsTableProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const fetchProducts = useCallback(async () => {
    if (!user?.userid) return;
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.search({
        status,
        sellerId: user.userid,
        page,
        size,
      });
      const data = Array.isArray(response.data) ? response.data : [];
      const metadata = (response as any).__raw__?.metadata;
      setProducts(data);
      setTotalPages(metadata?.totalPages || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [status, user?.userid, page, size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewDetails = (productId: number) =>
    navigate(`/products/${productId}`);
  const handleAppendDescription = (productId: number) =>
    navigate(`/seller/products/${productId}/append-description`);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const renderStatusBadge = () => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0 h-5">
            Đang diễn ra
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0 h-5">
            Đã kết thúc
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) return <PageLoader message="Đang tải..." className="min-h-50" />;
  if (error)
    return (
      <div className="text-center py-8 text-destructive text-sm">
        Lỗi: {error.message}
      </div>
    );

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Chưa có sản phẩm nào đang đấu giá</p>
        <Button
          className="mt-4"
          onClick={() => navigate("/seller/products/create")}
        >
          Đăng sản phẩm mới
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {products.map((product) => (
          <Card
            key={product.productid}
            className="group overflow-hidden border border-slate-200 shadow-sm hover:shadow bg-white transition-all"
          >
            {/* Flex container: Mobile = Cột, Tablet+ = Hàng */}
            <div className="flex flex-col sm:flex-row">
              {/* 1. Image Section */}
              {/* Mobile: Full width, height nhỏ (128px) */}
              {/* Tablet/Desktop: Fixed width nhỏ gọn (140px), height auto */}
              <div className="relative w-full h-32 sm:w-36 sm:h-auto md:w-44 shrink-0 bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.tenSanPham}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Box className="h-8 w-8" />
                  </div>
                )}

                {/* Badge trạng thái đè lên ảnh ở Mobile để tiết kiệm chỗ */}
                <div className="absolute top-2 left-2 sm:hidden shadow-sm">
                  {renderStatusBadge()}
                </div>
              </div>

              {/* 2. Content Section */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-2">
                {/* Top Row: Title & Menu */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    {/* Badge cho Desktop (nằm trên title) */}
                    <div className="hidden sm:block mb-1">
                      {renderStatusBadge()}
                    </div>

                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {product.tenSanPham}
                    </h3>

                    {/* Ẩn danh mục ở mobile để đỡ rối */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                      <Tag className="h-3 w-3" />
                      <span className="truncate max-w-37.5">
                        {product.tenDanhMuc || "Khác"}
                      </span>
                    </div>
                  </div>

                  {/* Menu Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 -mr-1 text-slate-400 hover:text-slate-700 shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(product.productid)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </DropdownMenuItem>
                      {status === "ACTIVE" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleAppendDescription(product.productid)
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Bổ sung mô tả
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Footer Info: Grid layout thông minh */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-3 pt-1.5 border-t border-slate-100">
                  {/* Giá: Luôn hiển thị to nhất */}
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      Giá hiện tại
                    </span>
                    <span className="font-bold text-sm sm:text-base text-primary truncate">
                      {formatPrice(product.giaHienTai)}
                    </span>
                  </div>

                  {/* Lượt đấu */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-medium flex items-center gap-1">
                      <Gavel className="h-3 w-3 hidden sm:inline" /> Lượt đấu
                    </span>
                    <span className="font-medium text-xs sm:text-sm text-slate-700">
                      {product.soLuotRaGia || 0}
                    </span>
                  </div>

                  {/* Thời gian: Mobile thu gọn format */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3 hidden sm:inline" /> Kết thúc
                    </span>
                    <span className="font-medium text-xs sm:text-sm text-slate-700 truncate">
                      {/* Mobile: Chỉ hiện giờ hoặc ngày rút gọn. Desktop: Full */}
                      <span className="md:hidden">
                        {format(new Date(product.thoiGianKetThuc), "dd/MM", {
                          locale: vi,
                        })}
                      </span>
                      <span className="hidden md:inline">
                        {format(
                          new Date(product.thoiGianKetThuc),
                          "HH:mm dd/MM/yy",
                          { locale: vi }
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <SimplePagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={products.length}
        pageSize={size}
        onPageChange={setPage}
      />
    </>
  );
}
