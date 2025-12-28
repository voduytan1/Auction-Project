import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { productAPI, type ProductResponse } from "@/services/product.api";
import { toast } from "sonner";
// import type { Product } from "../types";

export function ProductsTable() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [removing, setRemoving] = useState(false);
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    product: ProductResponse | null;
  }>({ open: false, product: null });

  // Fetch products on component mount and when search or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.search({
          search: searchQuery || undefined,
          page: currentPage,
          size: itemsPerPage,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        // Extract data and metadata
        const productsData = Array.isArray(response.data) ? response.data : [];
        const metadata = (response as any).__raw__?.metadata;

        setProducts(productsData);
        setTotalProducts(metadata?.totalElements ?? 0);
        setTotalPages(metadata?.totalPages ?? 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, itemsPerPage]);

  const handleRemove = (product: ProductResponse) => {
    setRemoveDialog({ open: true, product });
  };

  const confirmRemove = async () => {
    if (!removeDialog.product) return;

    try {
      setRemoving(true);
      await productAPI.delete(removeDialog.product.productid);

      toast.success("Sản phẩm đã được gỡ bỏ thành công");

      // Refresh list
      setProducts(
        products.filter((p) => p.productid !== removeDialog.product?.productid)
      );
      setRemoveDialog({ open: false, product: null });
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Không thể gỡ bỏ sản phẩm");
    } finally {
      setRemoving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      ACTIVE: { label: "Đang diễn ra", variant: "default" },
      PENDING: { label: "Chờ duyệt", variant: "secondary" },
      COMPLETED: { label: "Đã kết thúc", variant: "secondary" },
      CANCELLED: { label: "Đã hủy", variant: "destructive" },
    };
    const mapped = statusMap[status] || {
      label: status,
      variant: "secondary" as const,
    };
    return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Sản phẩm</CardTitle>
              <CardDescription>
                Danh sách tất cả sản phẩm đấu giá
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Giá khởi điểm</TableHead>
                  <TableHead>Giá hiện tại</TableHead>
                  <TableHead>Số lượt ra giá</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không tìm thấy sản phẩm
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.productid}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="line-clamp-1">
                            {product.tenSanPham}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {product.productid}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.tenDanhMuc}</Badge>
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {product.tenSeller}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(product.giaKhoiDiem)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(product.giaHienTai)}
                      </TableCell>
                      <TableCell>{product.soLuotRaGia || 0}</TableCell>
                      <TableCell>{getStatusBadge(product.trangThai)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/products/${product.productid}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {product.trangThai === "ACTIVE" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemove(product)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Gỡ bỏ sản phẩm
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalProducts)} trong tổng
                số {totalProducts} sản phẩm
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="flex items-center px-1 sm:px-2 text-xs sm:text-sm"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <AlertDialog
        open={removeDialog.open}
        onOpenChange={(open) =>
          setRemoveDialog({ open, product: removeDialog.product })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận gỡ bỏ sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn gỡ bỏ sản phẩm "
              {removeDialog.product?.tenSanPham}"? Sản phẩm sẽ không còn hiển
              thị trên hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              disabled={removing}
              className="bg-destructive"
            >
              {removing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Gỡ bỏ"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
