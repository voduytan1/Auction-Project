import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
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
import { PageLoader } from "@/components/PageLoader";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { userAPI } from "@/services/user.api";
import type { User } from "@/features/auth/types";
import type { CreateUserRequest, UpdateUserRequest } from "@/types/types";
import { useDebounce } from "@/features/admin/_shared/hooks";
import {
  TableSearchBar,
  SortableTableHead,
  TablePagination,
  TableLoadingState,
  TableEmptyState,
} from "@/features/admin/_shared/components";
import { UserFormDialog } from "./components/UserFormDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

export function UsersTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Search & Pagination State - Khởi tạo từ URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [itemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting State - Khởi tạo từ URL params
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  // Trigger loadUsers khi các deps thay đổi
  useEffect(() => {
    loadUsers();
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

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getAll({
        page: currentPage,
        size: itemsPerPage,
        search: debouncedSearch || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      // Interceptor đã extract data.data thành response.data
      // Metadata được lưu trong __metadata__
      const users = Array.isArray(response.data) ? response.data : [];
      const metadata = (response as any).__metadata__;

      setUsers(users);
      setTotalElements(metadata?.totalElements || 0);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Không thể tải danh sách người dùng");
      setUsers([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ open: true, user });
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

  const handleFormSubmit = async (data: {
    username: string;
    email: string;
    password?: string;
    hoVaTen: string;
    anhDaiDien?: string;
    vaitro?: "BIDDER" | "SELLER" | "ADMIN";
  }) => {
    try {
      setIsSubmitting(true);

      if (editingUser) {
        const updateData: UpdateUserRequest = {
          username: data.username,
          email: data.email,
          hoVaTen: data.hoVaTen,
          anhDaiDien: data.anhDaiDien,
        };
        await userAPI.update(editingUser.userid, updateData);
        toast.success("Cập nhật user thành công!");
      } else {
        const createData: CreateUserRequest = {
          username: data.username,
          email: data.email,
          password: data.password || "",
          hoVaTen: data.hoVaTen || "",
          vaitro: data.vaitro || "BIDDER",
          anhDaiDien: data.anhDaiDien,
        };
        await userAPI.create(createData);
        toast.success("Tạo user thành công!");
      }

      await loadUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.user) return;

    try {
      await userAPI.delete(deleteDialog.user.userid);
      toast.success("Xóa user thành công!");

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await loadUsers();
      }

      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Không thể xóa user. Vui lòng thử lại!");
    }
  };

  const totalPagesCalc = Math.ceil(totalElements / itemsPerPage);

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>QUẢN LÝ NGƯỜI DÙNG</CardTitle>
              <CardDescription>
                Danh sách tất cả người dùng trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm Người dùng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSearchBar
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm người dùng (tên, email, username)..."
            placeholderMobile="Tìm kiếm người dùng..."
          />

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    field="username"
                    label="Username"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    field="hoVaTen"
                    label="Họ và tên"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    className="hidden lg:table-cell"
                  />
                  <SortableTableHead
                    field="email"
                    label="Email"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    className="hidden md:table-cell"
                  />
                  <SortableTableHead
                    field="vaitro"
                    label="Vai trò"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableLoadingState colSpan={5} />
                ) : users.length === 0 ? (
                  <TableEmptyState
                    colSpan={5}
                    message="Không tìm thấy người dùng nào"
                  />
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userid}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.hoVaTen}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.vaitro === "ADMIN"
                              ? "destructive"
                              : user.vaitro === "SELLER"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.vaitro}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPagesCalc}
            totalItems={totalElements}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel="người dùng"
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
      />

      <DeleteUserDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, user: deleteDialog.user })
        }
        user={deleteDialog.user}
        onConfirm={confirmDelete}
      />
    </>
  );
}
