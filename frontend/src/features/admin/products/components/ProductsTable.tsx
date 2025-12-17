import { useState } from "react";
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
import { Search, Filter, MoreHorizontal, Eye, XCircle } from "lucide-react";
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
import { mockAdminProducts } from "@/data/mock-data";
import type { Product } from "../types";

export function ProductsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const handleRemove = (product: Product) => {
    setRemoveDialog({ open: true, product });
  };

  const confirmRemove = () => {
    // TODO: Call API to remove product
    console.log("Remove product:", removeDialog.product?.id);
    setRemoveDialog({ open: false, product: null });
  };

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
                  <TableHead>Số bids</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.title}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {product.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.seller}</TableCell>
                    <TableCell className="text-sm">
                      {product.startPrice}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {product.currentBid}
                    </TableCell>
                    <TableCell>{product.bids}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active"
                            ? "default"
                            : product.status === "removed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {product.status === "active"
                          ? "Đang diễn ra"
                          : product.status === "removed"
                          ? "Đã gỡ"
                          : "Đã kết thúc"}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {product.status === "active" && (
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
                ))}
              </TableBody>
            </Table>
          </div>
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
              {removeDialog.product?.title}"? Sản phẩm sẽ không còn hiển thị
              trên hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-destructive"
            >
              Gỡ bỏ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
