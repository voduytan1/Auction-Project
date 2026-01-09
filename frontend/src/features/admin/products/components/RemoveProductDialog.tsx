import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProductResponse } from "@/services/product.api";

interface RemoveProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse | null;
  onConfirm: () => Promise<void>;
}

export function RemoveProductDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
}: RemoveProductDialogProps) {
  const [removing, setRemoving] = useState(false);

  const handleConfirm = async () => {
    try {
      setRemoving(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy sản phẩm</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy sản phẩm "{product?.tenSanPham}"? Sản phẩm
            sẽ chuyển sang trạng thái đã hủy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={removing}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={removing}
          >
            {removing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Hủy sản phẩm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
