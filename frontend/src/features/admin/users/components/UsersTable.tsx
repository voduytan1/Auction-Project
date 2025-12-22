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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, UserPlus, Edit, Trash2, Loader2 } from "lucide-react";
import { userAPI } from "@/services/user.api";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/types";

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  hoVaTen: string;
  anhDaiDien?: string;
  vaitro?: "BIDDER" | "SELLER" | "ADMIN";
}

export function UsersTable() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: UserResponse | null;
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
      const userData = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];
      setUsers(userData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Không thể tải danh sách users!");
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

  const handleEdit = (user: UserResponse) => {
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

  const handleDelete = (user: UserResponse) => {
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
        await userAPI.update(editingUser.id, updateData);
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
      await userAPI.delete(deleteDialog.user.id);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
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
              <CardTitle>Quản lý Users</CardTitle>
              <CardDescription>
                Danh sách tất cả users trong hệ thống ({users.length} users)
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm User
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
                  <TableHead>Avatar</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        Không tìm thấy user nào
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
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
                      <TableCell>{user.anhDaiDien ? "📷" : "-"}</TableCell>
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
