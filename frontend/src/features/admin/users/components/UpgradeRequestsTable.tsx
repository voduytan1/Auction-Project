import { useState, useEffect } from "react";
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
import { Check, X, Eye } from "lucide-react";
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
import { toast } from "sonner";
import { adminAPI, type UpgradeRequestResponse } from "@/services/admin.api";

export function UpgradeRequestsTable() {
  const [requests, setRequests] = useState<UpgradeRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getPendingRequests({ size: 50, page: 1 });
      setRequests(response.data?.content || []);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Không thể tải danh sách yêu cầu!");
    } finally {
      setIsLoading(false);
    }
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
      await adminAPI.processRequest(confirmDialog.request.id, approve);

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
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Đang tải...</div>
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
              {requests.length} chờ duyệt
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có yêu cầu nào đang chờ duyệt
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{request.hoVaTen || request.username}</div>
                          <div className="text-xs text-muted-foreground">
                            @{request.username}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{request.email}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(request.requestedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "PENDING"
                              ? "secondary"
                              : request.status === "APPROVED"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.status === "PENDING"
                            ? "Chờ duyệt"
                            : request.status === "APPROVED"
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
                          {request.status === "PENDING" && (
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
                  {detailDialog.request.hoVaTen ||
                    detailDialog.request.username}{" "}
                  ({detailDialog.request.email})
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Username</div>
                <div className="text-sm text-muted-foreground">
                  @{detailDialog.request.username}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Ngày yêu cầu</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(
                    detailDialog.request.requestedAt
                  ).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Trạng thái</div>
                <div className="mt-1">
                  <Badge
                    variant={
                      detailDialog.request.status === "PENDING"
                        ? "secondary"
                        : detailDialog.request.status === "APPROVED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {detailDialog.request.status === "PENDING"
                      ? "Chờ duyệt"
                      : detailDialog.request.status === "APPROVED"
                      ? "Đã duyệt"
                      : "Đã từ chối"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {detailDialog.request?.status === "PENDING" && (
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
