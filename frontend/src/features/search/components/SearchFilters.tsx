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
import type { CategoryDisplay } from "@/types/types";

interface SearchFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  sortBy: string;
  categories: CategoryDisplay[];
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
    <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <form onSubmit={onSearchSubmit} className="space-y-3 sm:space-y-4">
        {/* Search input */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 h-9 sm:h-10 text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="h-9 sm:h-10 text-sm sm:text-base w-full sm:w-auto"
          >
            Tìm kiếm
          </Button>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3 md:gap-4">
          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full lg:w-50 h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort filter */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-50 h-9 sm:h-10 text-sm">
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
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="h-9 sm:h-10 text-sm w-full sm:w-auto sm:col-span-2 lg:col-span-1"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
