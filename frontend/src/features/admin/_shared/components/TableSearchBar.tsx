import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TableSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderMobile?: string;
}

export function TableSearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  placeholderMobile,
}: TableSearchBarProps) {
  return (
    <div className="mb-6">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-10"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile/Tablet */}
      <div className="lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholderMobile || placeholder}
            className="pl-10"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
