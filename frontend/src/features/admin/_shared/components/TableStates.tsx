import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TableLoadingStateProps {
  colSpan: number;
  message?: string;
}

export function TableLoadingState({
  colSpan,
  message = "Đang tải dữ liệu...",
}: TableLoadingStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          {message}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface TableEmptyStateProps {
  colSpan: number;
  message?: string;
}

export function TableEmptyState({
  colSpan,
  message = "Không tìm thấy dữ liệu",
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        <div className="text-muted-foreground">{message}</div>
      </TableCell>
    </TableRow>
  );
}
