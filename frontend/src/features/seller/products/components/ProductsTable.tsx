import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Ban,
  Star,
  MoreHorizontal,
  FileText,
  UserX,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";
import { useAppSelector } from "@/hooks/use-redux";
import { RejectBidderDialog } from "./RejectBidderDialog";
import { CancelTransactionDialog } from "./CancelTransactionDialog";

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

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  // Dialog states for new seller features
  const [rejectBidderOpen, setRejectBidderOpen] = useState(false);
  const [cancelTransactionOpen, setCancelTransactionOpen] = useState(false);

  // Fetch products from API based on status and seller
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

      // Response interceptor extracts data, metadata is in __raw__
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

  const handleViewDetails = (productId: number) => {
    // Navigate to product details page
    navigate(`/products/${productId}`);
  };

  const handleEdit = (productId: number) => {
    // Navigate to edit page
    navigate(`/seller/products/edit/${productId}`);
  };

  const handleCancelProduct = (product: ProductResponse) => {
    setSelectedProduct(product);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedProduct) return;

    try {
      // TODO: Call API to cancel product
      // await productApi.cancelProduct(selectedProduct.productid);
      toast.success("Đã hủy sản phẩm thành công!");
      setCancelDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts(); // Refresh products list
    } catch {
      toast.error("Không thể hủy sản phẩm. Vui lòng thử lại!");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRateBuyer = (_productId: number) => {
    // Open rating dialog
    // TODO: Implement rating functionality with productId
    toast.info("Tính năng đánh giá đang được phát triển");
  };

  const handleAppendDescription = (productId: number) => {
    navigate(`/seller/products/${productId}/append-description`);
  };

  const handleRejectBidder = (product: ProductResponse) => {
    setSelectedProduct(product);
    setRejectBidderOpen(true);
  };

  const handleCancelTransaction = (product: ProductResponse) => {
    setSelectedProduct(product);
    setCancelTransactionOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) {
    return <PageLoader message="Đang tải sản phẩm..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p className="text-lg font-medium">Lỗi: {error.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">Chưa có sản phẩm nào</p>
        <p className="text-sm mt-2">
          {status === "ACTIVE"
            ? "Bạn chưa có sản phẩm đang đấu giá"
            : status === "COMPLETED"
            ? "Bạn chưa có sản phẩm nào hoàn thành"
            : "Bạn chưa có sản phẩm nào bị hủy"}
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead className="text-right">Giá khởi điểm</TableHead>
            <TableHead className="text-right">Giá hiện tại</TableHead>
            <TableHead className="text-center">Số lượt đấu</TableHead>
            <TableHead>Thời gian kết thúc</TableHead>
            {status === "COMPLETED" && <TableHead>Người thắng</TableHead>}
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productid}>
              <TableCell className="font-medium">
                {product.tenSanPham}
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(product.giaKhoiDiem)}
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(product.giaHienTai)}
              </TableCell>
              <TableCell className="text-center">
                {product.soLuotRaGia || 0}
              </TableCell>
              <TableCell>{formatDate(product.thoiGianKetThuc)}</TableCell>
              {status === "COMPLETED" && (
                <TableCell>
                  {product.tenBidder ? (
                    <div>
                      <p className="font-medium">{product.tenBidder}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Chưa có người thắng
                    </span>
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(product.productid)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    {status === "ACTIVE" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleEdit(product.productid)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleAppendDescription(product.productid)
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Bổ sung mô tả
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRejectBidder(product)}
                          className="text-orange-600"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Từ chối người đấu giá
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCancelProduct(product)}
                          className="text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Hủy sản phẩm
                        </DropdownMenuItem>
                      </>
                    )}
                    {status === "COMPLETED" && product.tenBidder && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleRateBuyer(product.productid)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Đánh giá người mua
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCancelTransaction(product)}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Hủy giao dịch
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPage(pageNum)}
                      className="h-9 w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span
                      key={pageNum}
                      className="flex items-center px-2 text-sm"
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
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy sản phẩm "{selectedProduct?.tenSanPham}
              "? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Bidder Dialog */}
      {selectedProduct && selectedProduct.bidderId && (
        <RejectBidderDialog
          open={rejectBidderOpen}
          onOpenChange={setRejectBidderOpen}
          productId={selectedProduct.productid.toString()}
          productName={selectedProduct.tenSanPham}
          currentBidder={{
            userId: selectedProduct.bidderId,
            username: selectedProduct.tenBidder || selectedProduct.bidderId,
            currentBid: selectedProduct.giaHienTai,
          }}
          secondHighestBidder={{
            userId: "user456",
            username: "trusted_bidder",
            bidAmount: selectedProduct.giaHienTai - 500000,
          }}
        />
      )}

      {/* Cancel Transaction Dialog */}
      {selectedProduct &&
        selectedProduct.bidderId &&
        selectedProduct.tenBidder && (
          <CancelTransactionDialog
            open={cancelTransactionOpen}
            onOpenChange={setCancelTransactionOpen}
            productId={selectedProduct.productid.toString()}
            productName={selectedProduct.tenSanPham}
            winnerId={selectedProduct.bidderId}
            winnerName={selectedProduct.tenBidder}
            finalBid={selectedProduct.giaHienTai}
          />
        )}
    </>
  );
}
