import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CategoryResponse } from "@/types/types";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryResponse | null;
  onConfirm: () => Promise<void>;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục "{category?.tenDanhMuc}"? Hành
            động này không thể hoàn tác.
            {category?.level === 1 && (
              <span className="block mt-2 text-destructive font-medium">
                Cảnh báo: Xóa danh mục cha sẽ ảnh hưởng đến tất cả danh mục con!
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
