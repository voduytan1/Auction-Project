import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { PageLoader } from "@/components/PageLoader";
import { toast } from "sonner";
import { adminAPI, type UpgradeRequestResponse } from "@/services/admin.api";
import { useDebounce } from "@/features/admin/_shared/hooks";
import {
  TableSearchBar,
  SortableTableHead,
  TablePagination,
  TableLoadingState,
  TableEmptyState,
} from "@/features/admin/_shared/components";
import { UpgradeRequestDetailDialog } from "./components/UpgradeRequestDetailDialog";
import { UpgradeRequestConfirmDialog } from "./components/UpgradeRequestConfirmDialog";

export function UpgradeRequestsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState<UpgradeRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Sorting State
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "username"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "asc"
  );

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
  }, [currentPage, debouncedSearch, sortBy, sortOrder]);

  // Sync state với URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (currentPage > 1) params.page = currentPage.toString();
    if (debouncedSearch) params.search = debouncedSearch;
    if (sortBy !== "username") params.sortBy = sortBy;
    if (sortOrder !== "asc") params.sortOrder = sortOrder;
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, sortBy, sortOrder]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getPendingRequests({
        size: pageSize,
        page: currentPage,
        search: debouncedSearch || undefined,
      });
      // Handle both response structures: direct array or wrapped object
      const requestsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.content || [];
      setRequests(requestsData);

      // Backend uses 'metadata' field when wrapped
      const meta = response.data?.metadata || response.data?.pagination;

      setTotalPages(meta?.totalPages || 1);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Không thể tải danh sách yêu cầu!");
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
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

      await loadRequests();
      setConfirmDialog({ open: false, request: null, action: null });
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Không thể xử lý yêu cầu. Vui lòng thử lại!");
    }
  };

  // Sort requests locally (since API might not support sorting)
  const sortedRequests = [...requests].sort((a, b) => {
    let aValue: any = a[sortBy as keyof UpgradeRequestResponse];
    let bValue: any = b[sortBy as keyof UpgradeRequestResponse];

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  if (isInitialLoading) {
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
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>YÊU CẦU NÂNG CẤP TÀI KHOẢN</CardTitle>
            <CardDescription>
              Danh sách bidder xin nâng cấp lên seller
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <TableSearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm theo username..."
          />

          {isLoading && <TableLoadingState colSpan={5} />}

          {!isLoading && requests.length === 0 && (
            <TableEmptyState
              colSpan={5}
              message={
                searchTerm
                  ? "Không tìm thấy yêu cầu nào"
                  : "Không có yêu cầu nào đang chờ duyệt"
              }
            />
          )}

          {!isLoading && requests.length > 0 && (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      field="username"
                      label="Người dùng"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="lyDo"
                      label="Lý do"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    />
                    <SortableTableHead
                      field="ghiChuAdmin"
                      label="Ghi chú Admin"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="hidden lg:table-cell"
                    />
                    <SortableTableHead
                      field="trangThai"
                      label="Trạng thái"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRequests.map((request) => (
                    <TableRow key={request.requestid}>
                      <TableCell className="font-medium">
                        {request.username}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {request.lyDo || "Không có"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
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

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalPages * pageSize}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
            itemLabel="yêu cầu"
          />
        </CardContent>
      </Card>

      <UpgradeRequestDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog({ open, request: detailDialog.request })
        }
        request={detailDialog.request}
        onApprove={() => handleApprove(detailDialog.request!)}
        onReject={() => handleReject(detailDialog.request!)}
      />

      <UpgradeRequestConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ open: false, request: null, action: null })
        }
        request={confirmDialog.request}
        action={confirmDialog.action}
        onConfirm={confirmAction}
      />
    </>
  );
}
