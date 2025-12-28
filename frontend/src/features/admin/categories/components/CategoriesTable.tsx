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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { categoryApi } from "@/services/category.api";
import type { CategoryResponse, CategoryDisplay } from "@/types/types";

interface CategoryFormData {
  tenDanhMuc: string;
  parentCategoryId?: number;
  moTa?: string;
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState<"level1" | "level2">("level1");
  const [currentPageL1, setCurrentPageL1] = useState(1);
  const [currentPageL2, setCurrentPageL2] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: CategoryResponse | null;
  }>({ open: false, category: null });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const data = await categoryApi.getCategoryHierarchy();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Không thể tải danh mục!");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Get parent categories for level 2 form
  const parentCategories = categories;

  // Get level 1 (parent) categories
  const level1Categories = categories;

  // Get level 2 (child) categories - flatten from all subcategories
  const level2Categories = categories.flatMap(
    (parent) => parent.subcategories || []
  );

  // Pagination for Level 1
  const totalPagesL1 = Math.ceil(level1Categories.length / itemsPerPage);
  const startIndexL1 = (currentPageL1 - 1) * itemsPerPage;
  const endIndexL1 = startIndexL1 + itemsPerPage;
  const currentLevel1Categories = level1Categories.slice(
    startIndexL1,
    endIndexL1
  );

  // Pagination for Level 2
  const totalPagesL2 = Math.ceil(level2Categories.length / itemsPerPage);
  const startIndexL2 = (currentPageL2 - 1) * itemsPerPage;
  const endIndexL2 = startIndexL2 + itemsPerPage;
  const currentLevel2Categories = level2Categories.slice(
    startIndexL2,
    endIndexL2
  );

  const handleCreate = () => {
    setEditingCategory(null);
    reset({
      tenDanhMuc: "",
      parentCategoryId: undefined,
      moTa: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: CategoryResponse) => {
    setEditingCategory(category);
    reset({
      tenDanhMuc: category.tenDanhMuc,
      parentCategoryId: category.parentCategoryId || undefined,
      moTa: category.moTa || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: CategoryResponse) => {
    setDeleteDialog({ open: true, category });
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);

      if (editingCategory) {
        // Update category
        await categoryApi.update(editingCategory.categoryid, {
          tenDanhMuc: data.tenDanhMuc,
          moTa: data.moTa,
        });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // Create new category
        await categoryApi.create({
          tenDanhMuc: data.tenDanhMuc,
          moTa: data.moTa,
          parentCategoryId: data.parentCategoryId || undefined,
        });
        toast.success("Tạo danh mục thành công!");
      }

      // Refresh categories
      await loadCategories();
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.category) return;

    try {
      await categoryApi.delete(deleteDialog.category.categoryid);
      toast.success("Xóa danh mục thành công!");
      await loadCategories();
      setDeleteDialog({ open: false, category: null });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Không thể xóa danh mục. Vui lòng thử lại!");
    }
  };

  const renderCategoryRow = (
    category: CategoryResponse,
    showParent = false
  ) => (
    <TableRow key={category.categoryid}>
      <TableCell className="font-medium">{category.tenDanhMuc}</TableCell>
      {showParent && (
        <TableCell>
          {category.parentCategoryName ? (
            <Badge variant="outline">{category.parentCategoryName}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </TableCell>
      )}
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {category.moTa || "-"}
        </span>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleEdit(category)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(category)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );

  if (isLoadingCategories) {
    return (
      <Card>
        <CardContent className="py-12">
          <PageLoader message="Đang tải danh mục..." />
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
              <CardTitle>Quản lý Danh mục</CardTitle>
              <CardDescription>
                Quản lý tất cả danh mục sản phẩm trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Danh mục
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "level1" | "level2")}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="level1">
                Cấp 1 - Danh mục Cha ({level1Categories.length})
              </TabsTrigger>
              <TabsTrigger value="level2">
                Cấp 2 - Danh mục Con ({level2Categories.length})
              </TabsTrigger>
            </TabsList>

            {/* Level 1 - Parent Categories */}
            <TabsContent value="level1">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLevel1Categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <div className="text-muted-foreground">
                            Chưa có danh mục cấp 1
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentLevel1Categories.map((cat) => {
                        // Convert CategoryDisplay to CategoryResponse format
                        const categoryResponse: CategoryResponse = {
                          categoryid: cat.id,
                          tenDanhMuc: cat.name,
                          level: cat.level,
                          moTa: cat.description,
                          parentCategoryId: undefined,
                          parentCategoryName: undefined,
                        };
                        return renderCategoryRow(categoryResponse, false);
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination for Level 1 */}
              {totalPagesL1 > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {startIndexL1 + 1}-
                    {Math.min(endIndexL1, level1Categories.length)} trong tổng
                    số {level1Categories.length} danh mục
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPageL1(currentPageL1 - 1)}
                      disabled={currentPageL1 === 1}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        { length: totalPagesL1 },
                        (_, i) => i + 1
                      ).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPagesL1 ||
                          (page >= currentPageL1 - 1 &&
                            page <= currentPageL1 + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPageL1 === page ? "default" : "outline"
                              }
                              size="icon"
                              onClick={() => setCurrentPageL1(page)}
                              className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPageL1 - 2 ||
                          page === currentPageL1 + 2
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
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPageL1(currentPageL1 + 1)}
                      disabled={currentPageL1 === totalPagesL1}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Level 2 - Child Categories */}
            <TabsContent value="level2">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead>Danh mục Cha</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLevel2Categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="text-muted-foreground">
                            Chưa có danh mục cấp 2
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentLevel2Categories.map((cat) => {
                        const categoryResponse: CategoryResponse = {
                          categoryid: cat.id,
                          tenDanhMuc: cat.name,
                          level: cat.level,
                          moTa: cat.description,
                          parentCategoryId: cat.parentId,
                          parentCategoryName: cat.parentName,
                        };
                        return renderCategoryRow(categoryResponse, true);
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination for Level 2 */}
              {totalPagesL2 > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {startIndexL2 + 1}-
                    {Math.min(endIndexL2, level2Categories.length)} trong tổng
                    số {level2Categories.length} danh mục
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPageL2(currentPageL2 - 1)}
                      disabled={currentPageL2 === 1}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        { length: totalPagesL2 },
                        (_, i) => i + 1
                      ).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPagesL2 ||
                          (page >= currentPageL2 - 1 &&
                            page <= currentPageL2 + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPageL2 === page ? "default" : "outline"
                              }
                              size="icon"
                              onClick={() => setCurrentPageL2(page)}
                              className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPageL2 - 2 ||
                          page === currentPageL2 + 2
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
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPageL2(currentPageL2 + 1)}
                      disabled={currentPageL2 === totalPagesL2}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh sửa" : "Thêm"} Danh mục
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Cập nhật thông tin danh mục"
                : "Tạo danh mục mới. Để trống 'Danh mục cha' nếu muốn tạo danh mục cấp 1"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenDanhMuc">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenDanhMuc"
                {...register("tenDanhMuc", {
                  required: "Tên danh mục là bắt buộc",
                  maxLength: {
                    value: 100,
                    message: "Tên danh mục không được quá 100 ký tự",
                  },
                })}
                placeholder="Nhập tên danh mục"
              />
              {errors.tenDanhMuc && (
                <p className="text-sm text-destructive">
                  {errors.tenDanhMuc.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentCategoryId">Danh mục Cha (tuỳ chọn)</Label>
              <Select
                value={watch("parentCategoryId")?.toString() || "none"}
                onValueChange={(value) =>
                  setValue(
                    "parentCategoryId",
                    value === "none" ? undefined : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha (hoặc để trống cho cấp 1)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không (Danh mục cấp 1)</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Để trống để tạo danh mục cấp 1 (cha). Chọn danh mục để tạo cấp 2
                (con)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moTa">Mô tả (tuỳ chọn)</Label>
              <Textarea
                id="moTa"
                {...register("moTa", {
                  maxLength: {
                    value: 500,
                    message: "Mô tả không được quá 500 ký tự",
                  },
                })}
                placeholder="Nhập mô tả danh mục"
                rows={3}
              />
              {errors.moTa && (
                <p className="text-sm text-destructive">
                  {errors.moTa.message}
                </p>
              )}
            </div>

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
                {editingCategory ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, category: deleteDialog.category })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "
              {deleteDialog.category?.tenDanhMuc}"? Hành động này không thể hoàn
              tác.
              {deleteDialog.category?.level === 1 && (
                <span className="block mt-2 text-destructive font-medium">
                  Cảnh báo: Xóa danh mục cha sẽ ảnh hưởng đến tất cả danh mục
                  con!
                </span>
              )}
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
