import { useState } from "react";
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
import { mockUpgradeRequests } from "@/data/mock-data";
import type { UpgradeRequest } from "../types";

export function UpgradeRequestsTable() {
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    request: UpgradeRequest | null;
  }>({ open: false, request: null });

  const handleApprove = (request: UpgradeRequest) => {
    // TODO: Call API to approve upgrade
    console.log("Approve upgrade request:", request.id);
  };

  const handleReject = (request: UpgradeRequest) => {
    // TODO: Call API to reject upgrade
    console.log("Reject upgrade request:", request.id);
  };

  const pendingRequests = mockUpgradeRequests.filter(
    (r) => r.status === "pending"
  );

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
              {pendingRequests.length} chờ duyệt
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Tổng bids</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUpgradeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{request.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={request.rating >= 90 ? "default" : "secondary"}
                      >
                        {request.rating}%
                      </Badge>
                    </TableCell>
                    <TableCell>{request.totalBids} bids</TableCell>
                    <TableCell className="text-sm">
                      {request.requestDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "secondary"
                            : request.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {request.status === "pending"
                          ? "Chờ duyệt"
                          : request.status === "approved"
                          ? "Đã duyệt"
                          : "Từ chối"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDetailDialog({ open: true, request })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(request)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(request)}
                            >
                              <X className="h-4 w-4" />
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
                  {detailDialog.request.userName} ({detailDialog.request.email})
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Rating</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.rating}%
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tổng số bids</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.totalBids} bids
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Lý do</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.reason}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Ngày yêu cầu</div>
                <div className="text-sm text-muted-foreground">
                  {detailDialog.request.requestDate}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {detailDialog.request?.status === "pending" && (
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
    </>
  );
}
