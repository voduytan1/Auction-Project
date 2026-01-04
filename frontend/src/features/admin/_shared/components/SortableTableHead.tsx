import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortableTableHeadProps {
  field: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortableTableHead({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
  className = "",
}: SortableTableHeadProps) {
  const isActive = sortBy === field;

  const SortIcon = () => {
    if (!isActive) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 hover:bg-transparent font-semibold -mx-3 px-3 justify-start w-full"
      >
        {label}
        {SortIcon()}
      </Button>
    </TableHead>
  );
}
