import { useState, useEffect } from "react";
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
import { Check, X, Eye, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageLoader } from "@/components/PageLoader";
import { toast } from "sonner";
import { adminAPI, type UpgradeRequestResponse } from "@/services/admin.api";

export function UpgradeRequestsTable() {
  const [requests, setRequests] = useState<UpgradeRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    request: UpgradeRequestResponse | null;
  }>({ open: false, request: null });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    request: UpgradeRequestResponse | null;
    action: "approve" | "reject" | null;
  }>({ open: false, request: null, action: null });

  useEffect(() => {
    loadRequests();
  }, [currentPage, searchTerm]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getPendingRequests({
        size: pageSize,
        page: currentPage,
        search: searchTerm || undefined,
      });
      // Handle both response structures: direct array or wrapped object
      const requestsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.content || [];
      setRequests(requestsData);

      // Backend uses 'metadata' field when wrapped
      const meta = response.data?.metadata || response.data?.pagination;

      setTotalPages(meta?.totalPages || 1);
      setTotalElements(meta?.totalElements || requestsData.length);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Không thể tải danh sách yêu cầu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleApprove = (request: UpgradeRequestResponse) => {
    setConfirmDialog({ open: true, request, action: "approve" });
  };

  const handleReject = (request: UpgradeRequestResponse) => {
    setConfirmDialog({ open: true, request, action: "reject" });
  };

  const confirmAction = async () => {
    if (!confirmDialog.request || !confirmDialog.action) return;

    try {
      const approve = confirmDialog.action === "approve";
      await adminAPI.processRequest(confirmDialog.request.requestid, approve);

      toast.success(
        approve ? "Đã duyệt yêu cầu thành công!" : "Đã từ chối yêu cầu!"
      );

      // Reload requests
      await loadRequests();
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Không thể xử lý yêu cầu. Vui lòng thử lại!");
    } finally {
      setConfirmDialog({ open: false, request: null, action: null });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <PageLoader message="Đang tải danh sách yêu cầu..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Yêu cầu nâng cấp tài khoản</CardTitle>
              <CardDescription>
                Danh sách bidder xin nâng cấp lên seller
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {totalElements} yêu cầu
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo username..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Không tìm thấy yêu cầu nào"
                : "Không có yêu cầu nào đang chờ duyệt"}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Ghi chú Admin</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.requestid}>
                      <TableCell className="font-medium">
                        {request.username}
                      </TableCell>
                      <TableCell className="text-sm">
                        {request.lyDo || "Không có"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {request.ghiChuAdmin || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.trangThai === "PENDING"
                              ? "secondary"
                              : request.trangThai === "APPROVED"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.trangThai === "PENDING"
                            ? "Chờ duyệt"
                            : request.trangThai === "APPROVED"
                            ? "Đã duyệt"
                            : "Đã từ chối"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDetailDialog({ open: true, request })
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.trangThai === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(request)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Duyệt
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog({ open, request: detailDialog.request })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu nâng cấp</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu nâng cấp tài khoản
            </DialogDescription>
          </DialogHeader>
          {detailDialog.request && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Người dùng</div>
                <div className="text-sm text-muted-foreground">
                  @{detailDialog.request.username}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">User ID</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {detailDialog.request.userid}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Lý do xin nâng cấp</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.lyDo || "Không có lý do"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Ghi chú của Admin</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.ghiChuAdmin || "Chưa có ghi chú"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Trạng thái</div>
                <div className="mt-1">
                  <Badge
                    variant={
                      detailDialog.request.trangThai === "PENDING"
                        ? "secondary"
                        : detailDialog.request.trangThai === "APPROVED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {detailDialog.request.trangThai === "PENDING"
                      ? "Chờ duyệt"
                      : detailDialog.request.trangThai === "APPROVED"
                      ? "Đã duyệt"
                      : "Đã từ chối"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {detailDialog.request?.trangThai === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(detailDialog.request!);
                    setDetailDialog({ open: false, request: null });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(detailDialog.request!);
                    setDetailDialog({ open: false, request: null });
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Duyệt
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ open: false, request: null, action: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "approve"
                ? "Xác nhận duyệt yêu cầu"
                : "Xác nhận từ chối yêu cầu"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "approve" ? (
                <>
                  Bạn có chắc chắn muốn duyệt yêu cầu nâng cấp của{" "}
                  <strong>{confirmDialog.request?.username}</strong> lên Seller?
                  <br />
                  <br />
                  Sau khi duyệt, user này sẽ có quyền tạo và quản lý sản phẩm
                  đấu giá.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn từ chối yêu cầu nâng cấp của{" "}
                  <strong>{confirmDialog.request?.username}</strong>?
                  <br />
                  <br />
                  User sẽ nhận được thông báo về việc từ chối và có thể gửi yêu
                  cầu mới sau này.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                confirmDialog.action === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {confirmDialog.action === "approve" ? "Duyệt" : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
