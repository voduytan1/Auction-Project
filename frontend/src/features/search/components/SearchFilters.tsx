import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Category } from "@/types/types";

interface SearchFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  sortBy: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
}

export function SearchFilters({
  searchQuery,
  categoryFilter,
  sortBy,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onSearchSubmit,
  onClearFilters,
  showClearButton,
}: SearchFiltersProps) {
  return (
    <Card className="p-6 mb-8">
      <form onSubmit={onSearchSubmit} className="space-y-4">
        {/* Search input */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm (hỗ trợ tiếng Việt không dấu)..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-4">
          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.categoryid}
                  value={cat.categoryid.toString()}
                >
                  {cat.tenDanhMuc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort filter */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="endTime-desc">Sắp kết thúc</SelectItem>
              <SelectItem value="endTime-asc">Mới nhất</SelectItem>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              <SelectItem value="bids-desc">Nhiều lượt đấu giá</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {showClearButton && (
            <Button variant="outline" onClick={onClearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
