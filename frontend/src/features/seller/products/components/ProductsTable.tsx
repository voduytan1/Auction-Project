import { useState } from "react";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { AppendDescriptionDialog } from "./AppendDescriptionDialog";
import { RejectBidderDialog } from "./RejectBidderDialog";
import { CancelTransactionDialog } from "./CancelTransactionDialog";

interface Product {
  id: string;
  tenSanPham: string;
  giaKhoiDiem: number;
  giaHienTai: number;
  soLuotDauGia: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  trangThai: string;
  nguoiThang?: {
    username: string;
    hoVaTen: string;
  };
}

interface ProductsTableProps {
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export function ProductsTable({ status }: ProductsTableProps) {
  const navigate = useNavigate();

  // Mock data for different statuses
  const mockProducts: Record<string, Product[]> = {
    ACTIVE: [
      {
        id: "1",
        tenSanPham: "iPhone 15 Pro Max 256GB",
        giaKhoiDiem: 25000000,
        giaHienTai: 28500000,
        soLuotDauGia: 12,
        thoiGianBatDau: "2024-12-20T10:00:00",
        thoiGianKetThuc: "2024-12-25T18:00:00",
        trangThai: "ACTIVE",
      },
      {
        id: "2",
        tenSanPham: "MacBook Pro M3 14 inch",
        giaKhoiDiem: 35000000,
        giaHienTai: 37200000,
        soLuotDauGia: 8,
        thoiGianBatDau: "2024-12-21T09:00:00",
        thoiGianKetThuc: "2024-12-26T20:00:00",
        trangThai: "ACTIVE",
      },
      {
        id: "3",
        tenSanPham: "Sony WH-1000XM5 - Tai nghe chống ồn cao cấp",
        giaKhoiDiem: 5000000,
        giaHienTai: 5500000,
        soLuotDauGia: 15,
        thoiGianBatDau: "2024-12-19T14:00:00",
        thoiGianKetThuc: "2024-12-24T22:00:00",
        trangThai: "ACTIVE",
      },
    ],
    COMPLETED: [
      {
        id: "4",
        tenSanPham: "iPad Air M2 2024 - 128GB",
        giaKhoiDiem: 12000000,
        giaHienTai: 14500000,
        soLuotDauGia: 20,
        thoiGianBatDau: "2024-12-10T10:00:00",
        thoiGianKetThuc: "2024-12-15T18:00:00",
        trangThai: "COMPLETED",
        nguoiThang: {
          username: "bidder123",
          hoVaTen: "Nguyễn Văn A",
        },
      },
      {
        id: "5",
        tenSanPham: "Samsung Galaxy S24 Ultra",
        giaKhoiDiem: 20000000,
        giaHienTai: 23800000,
        soLuotDauGia: 18,
        thoiGianBatDau: "2024-12-08T09:00:00",
        thoiGianKetThuc: "2024-12-13T20:00:00",
        trangThai: "COMPLETED",
        nguoiThang: {
          username: "buyer456",
          hoVaTen: "Trần Thị B",
        },
      },
    ],
    CANCELLED: [
      {
        id: "6",
        tenSanPham: "AirPods Pro 2nd Gen",
        giaKhoiDiem: 4500000,
        giaHienTai: 4500000,
        soLuotDauGia: 0,
        thoiGianBatDau: "2024-12-05T10:00:00",
        thoiGianKetThuc: "2024-12-10T18:00:00",
        trangThai: "CANCELLED",
      },
    ],
  };

  const [products] = useState<Product[]>(mockProducts[status] || []);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dialog states for new seller features
  const [appendDescOpen, setAppendDescOpen] = useState(false);
  const [rejectBidderOpen, setRejectBidderOpen] = useState(false);
  const [cancelTransactionOpen, setCancelTransactionOpen] = useState(false);

  // TODO: Fetch products from API based on status
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const data = await productApi.getSellerProducts(status);
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, [status]);

  const handleViewDetails = (productId: string) => {
    // Navigate to product details page
    navigate(`/products/${productId}`);
  };

  const handleEdit = (productId: string) => {
    // Navigate to edit page
    navigate(`/seller/products/edit/${productId}`);
  };

  const handleCancelProduct = (product: Product) => {
    setSelectedProduct(product);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedProduct) return;

    try {
      // TODO: Call API to cancel product
      // await productApi.cancelProduct(selectedProduct.id);
      toast.success("Đã hủy sản phẩm thành công!");
      setCancelDialogOpen(false);
      setSelectedProduct(null);
      // Refresh products list
    } catch {
      toast.error("Không thể hủy sản phẩm. Vui lòng thử lại!");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRateBuyer = (_productId: string) => {
    // Open rating dialog
    // TODO: Implement rating functionality with productId
    toast.info("Tính năng đánh giá đang được phát triển");
  };

  const handleAppendDescription = (product: Product) => {
    setSelectedProduct(product);
    setAppendDescOpen(true);
  };

  const handleRejectBidder = (product: Product) => {
    setSelectedProduct(product);
    setRejectBidderOpen(true);
  };

  const handleCancelTransaction = (product: Product) => {
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
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
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
                {product.soLuotDauGia}
              </TableCell>
              <TableCell>{formatDate(product.thoiGianKetThuc)}</TableCell>
              {status === "COMPLETED" && (
                <TableCell>
                  {product.nguoiThang ? (
                    <div>
                      <p className="font-medium">
                        {product.nguoiThang.hoVaTen}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{product.nguoiThang.username}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Chưa có người thắng
                    </span>
                  )}
                </TableCell>
              )}
              <TableCell className="text-center">
                <Badge
                  variant={
                    product.trangThai === "ACTIVE"
                      ? "default"
                      : product.trangThai === "COMPLETED"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {product.trangThai === "ACTIVE"
                    ? "Đang đấu giá"
                    : product.trangThai === "COMPLETED"
                    ? "Đã kết thúc"
                    : "Đã hủy"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(product.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    {status === "ACTIVE" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAppendDescription(product)}
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
                    {status === "COMPLETED" && product.nguoiThang && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleRateBuyer(product.id)}
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

      {/* Append Description Dialog */}
      {selectedProduct && (
        <AppendDescriptionDialog
          open={appendDescOpen}
          onOpenChange={setAppendDescOpen}
          productId={selectedProduct.id}
          productName={selectedProduct.tenSanPham}
          currentDescription="Sản phẩm chính hãng, còn bảo hành 11 tháng. Máy nguyên seal, chưa kích hoạt. Đầy đủ phụ kiện theo hộp."
        />
      )}

      {/* Reject Bidder Dialog */}
      {selectedProduct && (
        <RejectBidderDialog
          open={rejectBidderOpen}
          onOpenChange={setRejectBidderOpen}
          productId={selectedProduct.id}
          productName={selectedProduct.tenSanPham}
          currentBidder={{
            userId: "user123",
            username: "bidder_suspicious",
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
      {selectedProduct && selectedProduct.nguoiThang && (
        <CancelTransactionDialog
          open={cancelTransactionOpen}
          onOpenChange={setCancelTransactionOpen}
          productId={selectedProduct.id}
          productName={selectedProduct.tenSanPham}
          winnerId={selectedProduct.nguoiThang.username}
          winnerName={selectedProduct.nguoiThang.hoVaTen}
          finalBid={selectedProduct.giaHienTai}
        />
      )}
    </>
  );
}
