import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, XCircle } from "lucide-react";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { toast } from "sonner";
import { PageLoader } from "@/components/PageLoader";
import { useDebounce } from "@/features/admin/_shared/hooks";
import {
  TableSearchBar,
  SortableTableHead,
  TablePagination,
  TableLoadingState,
  TableEmptyState,
} from "@/features/admin/_shared/components";
import { RemoveProductDialog } from "./components/RemoveProductDialog";

export function ProductsTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    product: ProductResponse | null;
  }>({ open: false, product: null });

  // Trigger loadProducts khi các deps thay đổi
  useEffect(() => {
    loadProducts();
  }, [currentPage, debouncedSearch, sortBy, sortOrder]);

  // Sync state với URL params
  useEffect(() => {
    const params: Record<string, string> = {};

    if (currentPage > 1) params.page = currentPage.toString();
    if (debouncedSearch) params.search = debouncedSearch;
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (sortOrder !== "desc") params.sortOrder = sortOrder;

    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, sortBy, sortOrder]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.search({
        search: debouncedSearch || undefined,
        page: currentPage,
        size: itemsPerPage,
        sortBy: sortBy,
        sortOrder: sortOrder,
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
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handleRemove = (product: ProductResponse) => {
    setRemoveDialog({ open: true, product });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const confirmRemove = async () => {
    if (!removeDialog.product) return;

    try {
      await productAPI.cancel(removeDialog.product.productid);
      toast.success("Sản phẩm đã được hủy thành công");

      // Refresh list
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await loadProducts();
      }
    } catch (error) {
      console.error("Error canceling product:", error);
      toast.error("Không thể hủy sản phẩm");
      throw error;
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

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>QUẢN LÝ SẢN PHẨM</CardTitle>
              <CardDescription>
                Danh sách tất cả sản phẩm đấu giá
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableSearchBar
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm sản phẩm (tên, mô tả)..."
            placeholderMobile="Tìm kiếm sản phẩm..."
          />

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    field="tenSanPham"
                    label="Sản phẩm"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <TableHead className="hidden lg:table-cell">
                    Danh mục
                  </TableHead>
                  <SortableTableHead
                    field="giaKhoiDiem"
                    label="Giá khởi điểm"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    className="hidden md:table-cell"
                  />
                  <SortableTableHead
                    field="giaHienTai"
                    label="Giá hiện tại"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <TableHead className="hidden md:table-cell">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableLoadingState colSpan={6} />
                ) : products.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message="Không tìm thấy sản phẩm"
                  />
                ) : (
                  products.map((product) => (
                    <TableRow key={product.productid}>
                      <TableCell className="w-62.5">
                        <div className="line-clamp-2 wrap-break-word whitespace-normal pr-4">
                          {product.tenSanPham}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{product.tenDanhMuc}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatCurrency(product.giaKhoiDiem)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(product.giaHienTai)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(product.trangThai)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/products/${product.productid}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {product.trangThai === "ACTIVE" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(product)}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel="sản phẩm"
          />
        </CardContent>
      </Card>

      <RemoveProductDialog
        open={removeDialog.open}
        onOpenChange={(open) =>
          setRemoveDialog({ open, product: removeDialog.product })
        }
        product={removeDialog.product}
        onConfirm={confirmRemove}
      />
    </>
  );
}
