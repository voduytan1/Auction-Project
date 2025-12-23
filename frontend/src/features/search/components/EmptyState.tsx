import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="p-12 text-center">
      <div className="text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Không tìm thấy sản phẩm nào</p>
        <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
      </div>
    </Card>
  );
}
