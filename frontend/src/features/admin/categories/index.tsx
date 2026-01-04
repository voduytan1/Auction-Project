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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categoryApi } from "@/services/category.api";
import type { CategoryResponse, CategoryDisplay } from "@/types/types";
import { useDebounce } from "@/features/admin/_shared/hooks";
import {
  TableSearchBar,
  TablePagination,
  TableLoadingState,
  TableEmptyState,
} from "@/features/admin/_shared/components";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { PageLoader } from "@/components/PageLoader";

interface CategoryFormData {
  tenDanhMuc: string;
  parentCategoryId?: number;
  moTa?: string;
}

export function CategoriesTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState<"level1" | "level2">(
    (searchParams.get("tab") as "level1" | "level2") || "level1"
  );
  const [currentPageL1, setCurrentPageL1] = useState(
    parseInt(searchParams.get("pageL1") || "1")
  );
  const [currentPageL2, setCurrentPageL2] = useState(
    parseInt(searchParams.get("pageL2") || "1")
  );
  const [itemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: CategoryResponse | null;
  }>({ open: false, category: null });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeTab !== "level1") params.tab = activeTab;
    if (currentPageL1 > 1) params.pageL1 = currentPageL1.toString();
    if (currentPageL2 > 1) params.pageL2 = currentPageL2.toString();
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    activeTab,
    currentPageL1,
    currentPageL2,
    setSearchParams,
  ]);

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
      setIsInitialLoading(false);
    }
  };

  // Get parent categories for level 2 form
  const parentCategories = categories;

  // Filter categories based on search query
  const filterCategories = (cats: CategoryDisplay[]) => {
    let filtered = cats;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          cat.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get level 1 (parent) categories
  const allLevel1Categories = categories;
  const filteredLevel1 = filterCategories(allLevel1Categories);

  // Get level 2 (child) categories - flatten from all subcategories
  const allLevel2Categories = categories.flatMap(
    (parent) => parent.subcategories || []
  );
  const filteredLevel2 = filterCategories(allLevel2Categories);

  // Display filtered categories
  const level1Categories = filteredLevel1;
  const level2Categories = filteredLevel2;

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
    setIsDialogOpen(true);
  };

  const handleEdit = (category: CategoryResponse) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: CategoryResponse) => {
    setDeleteDialog({ open: true, category });
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
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
        <TableCell className="hidden lg:table-cell">
          {category.parentCategoryName ? (
            <Badge variant="outline">{category.parentCategoryName}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </TableCell>
      )}
      <TableCell
        className={showParent ? "hidden md:table-cell" : "hidden md:table-cell"}
      >
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

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>QUẢN LÝ DANH MỤC</CardTitle>
              <CardDescription>
                Quản lý tất cả danh mục sản phẩm trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Thêm Danh mục
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSearchBar
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            placeholder="Tìm kiếm danh mục (tên, mô tả)..."
            placeholderMobile="Tìm kiếm danh mục..."
          />

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "level1" | "level2")}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="level1">
                <span className="hidden sm:inline">Cấp 1 - Danh mục Cha</span>
                <span className="sm:hidden">Cấp 1</span>
                <span className="ml-1">({level1Categories.length})</span>
              </TabsTrigger>
              <TabsTrigger value="level2">
                <span className="hidden sm:inline">Cấp 2 - Danh mục Con</span>
                <span className="sm:hidden">Cấp 2</span>
                <span className="ml-1">({level2Categories.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Level 1 - Parent Categories */}
            <TabsContent value="level1">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Mô tả
                      </TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCategories ? (
                      <TableLoadingState colSpan={3} />
                    ) : currentLevel1Categories.length === 0 ? (
                      <TableEmptyState
                        colSpan={3}
                        message="Chưa có danh mục cấp 1"
                      />
                    ) : (
                      currentLevel1Categories.map((cat) => {
                        // Convert CategoryDisplay to CategoryResponse format
                        const categoryResponse: CategoryResponse = {
                          categoryid: cat.id,
                          tenDanhMuc: cat.name,
                          level: cat.level,
                          moTa: cat.description || undefined,
                          parentCategoryId: undefined,
                          parentCategoryName: undefined,
                        };
                        return renderCategoryRow(categoryResponse, false);
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                currentPage={currentPageL1}
                totalPages={totalPagesL1}
                totalItems={level1Categories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPageL1}
                itemLabel="danh mục"
              />
            </TabsContent>

            {/* Level 2 - Child Categories */}
            <TabsContent value="level2">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Danh mục Cha
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Mô tả
                      </TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCategories ? (
                      <TableLoadingState colSpan={4} />
                    ) : currentLevel2Categories.length === 0 ? (
                      <TableEmptyState
                        colSpan={4}
                        message="Chưa có danh mục cấp 2"
                      />
                    ) : (
                      currentLevel2Categories.map((cat) => {
                        const categoryResponse: CategoryResponse = {
                          categoryid: cat.id,
                          tenDanhMuc: cat.name,
                          level: cat.level,
                          moTa: cat.description || undefined,
                          parentCategoryId: cat.parentId || undefined,
                          parentCategoryName: cat.parentName || undefined,
                        };
                        return renderCategoryRow(categoryResponse, true);
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                currentPage={currentPageL2}
                totalPages={totalPagesL2}
                totalItems={level2Categories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPageL2}
                itemLabel="danh mục"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        parentCategories={parentCategories}
      />

      <DeleteCategoryDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, category: deleteDialog.category })
        }
        category={deleteDialog.category}
        onConfirm={confirmDelete}
      />
    </>
  );
}
