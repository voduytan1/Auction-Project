import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="p-6 sm:p-8 md:p-12 text-center">
      <div className="text-muted-foreground">
        <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Không tìm thấy sản phẩm nào</p>
        <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
      </div>
    </Card>
  );
}
