import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PageLoader } from "@/components/PageLoader";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { userAPI } from "@/services/user.api";
import type { User } from "@/features/auth/types";
import type { CreateUserRequest, UpdateUserRequest } from "@/types/types";

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  hoVaTen: string;
  anhDaiDien?: string;
  vaitro?: "BIDDER" | "SELLER" | "ADMIN";
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>();

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getAll();

      // Handle both response structures: direct array or wrapped object
      const userData = Array.isArray(response.data) ? response.data : [];
      setUsers(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    reset({
      username: "",
      email: "",
      password: "",
      hoVaTen: "",
      anhDaiDien: "",
      vaitro: "BIDDER",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      username: user.username,
      email: user.email,
      hoVaTen: user.hoVaTen || "",
      anhDaiDien: user.anhDaiDien || "",
      vaitro: user.vaitro,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);

      if (editingUser) {
        // Update user
        const updateData: UpdateUserRequest = {
          username: data.username,
          email: data.email,
          hoVaTen: data.hoVaTen,
          anhDaiDien: data.anhDaiDien,
        };
        await userAPI.update(editingUser.userid, updateData);
        toast.success("Cập nhật user thành công!");
      } else {
        // Create new user
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
      reset();
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
      await loadUsers();
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Không thể xóa user. Vui lòng thử lại!");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.hoVaTen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPagesCalc = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <PageLoader message="Đang tải danh sách người dùng..." />
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
              <CardTitle>Quản lý Người dùng</CardTitle>
              <CardDescription>
                Danh sách tất cả người dùng trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm Người dùng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm user (tên, email, username)..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        Không tìm thấy user nào
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentUsers.map((user) => (
                    <TableRow key={user.userid}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.hoVaTen}</TableCell>
                      <TableCell>{user.email}</TableCell>
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

          {/* Pagination */}
          {totalPagesCalc > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1}-
                {Math.min(endIndex, filteredUsers.length)} trong tổng số{" "}
                {filteredUsers.length} người dùng
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
                  {Array.from({ length: totalPagesCalc }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPagesCalc ||
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
                  disabled={currentPage === totalPagesCalc}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Chỉnh sửa" : "Thêm"} User</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Cập nhật thông tin user"
                : "Tạo user mới trong hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                {...register("username", {
                  required: "Username là bắt buộc",
                  minLength: {
                    value: 3,
                    message: "Username tối thiểu 3 ký tự",
                  },
                  maxLength: { value: 50, message: "Username tối đa 50 ký tự" },
                })}
                placeholder="Nhập username"
                disabled={!!editingUser}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Mật khẩu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: !editingUser ? "Mật khẩu là bắt buộc" : false,
                    minLength: {
                      value: 6,
                      message: "Mật khẩu tối thiểu 6 ký tự",
                    },
                    maxLength: {
                      value: 100,
                      message: "Mật khẩu tối đa 100 ký tự",
                    },
                  })}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="hoVaTen">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hoVaTen"
                {...register("hoVaTen", {
                  required: "Họ và tên là bắt buộc",
                  maxLength: {
                    value: 100,
                    message: "Họ và tên tối đa 100 ký tự",
                  },
                })}
                placeholder="Nhập họ và tên"
              />
              {errors.hoVaTen && (
                <p className="text-sm text-destructive">
                  {errors.hoVaTen.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="anhDaiDien">Ảnh đại diện (URL)</Label>
              <Input
                id="anhDaiDien"
                {...register("anhDaiDien")}
                placeholder="Nhập URL ảnh đại diện"
              />
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="vaitro">Vai trò</Label>
                <Select
                  value={watch("vaitro") || "BIDDER"}
                  onValueChange={(value: "BIDDER" | "SELLER" | "ADMIN") =>
                    setValue("vaitro", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BIDDER">Người đấu giá</SelectItem>
                    <SelectItem value="SELLER">Người bán</SelectItem>
                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingUser ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, user: deleteDialog.user })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa user</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa user "{deleteDialog.user?.hoVaTen}" (@
              {deleteDialog.user?.username})? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
