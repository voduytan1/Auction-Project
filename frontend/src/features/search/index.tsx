import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SearchFilters } from "./components/SearchFilters";
import { ProductCard } from "./components/ProductCard";
import { EmptyState } from "./components/EmptyState";
import { Pagination } from "./components/Pagination";
import { removeVietnameseTones } from "./helpers";
import { mockSearchProducts } from "@/data/search-mock";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "endTime-desc"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const itemsPerPage = 12;

  // Update URL khi filters thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (sortBy !== "endTime-desc") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy, currentPage, setSearchParams]);

  // Filter và search logic
  const filteredProducts = useMemo(() => {
    let filtered = mockSearchProducts;

    // Full-text search (không dấu)
    if (searchQuery.trim()) {
      const normalizedQuery = removeVietnameseTones(searchQuery.trim());
      filtered = filtered.filter((product) => {
        const normalizedTitle = removeVietnameseTones(product.tenSanPham);
        const normalizedDesc = removeVietnameseTones(product.moTa || "");
        return (
          normalizedTitle.includes(normalizedQuery) ||
          normalizedDesc.includes(normalizedQuery)
        );
      });
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category.categoryid.toString() === categoryFilter
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "endTime-desc":
          return (
            new Date(a.thoiGianKetThuc).getTime() -
            new Date(b.thoiGianKetThuc).getTime()
          );
        case "endTime-asc":
          return (
            new Date(b.thoiGianKetThuc).getTime() -
            new Date(a.thoiGianKetThuc).getTime()
          );
        case "price-asc":
          return a.giaHienTai - b.giaHienTai;
        case "price-desc":
          return b.giaHienTai - a.giaHienTai;
        case "bids-desc":
          return b.soLuotRaGia - a.soLuotRaGia;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, categoryFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique categories from products
  const categories = Array.from(
    new Map(
      mockSearchProducts.map((p) => [p.category.categoryid, p.category])
    ).values()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("endTime-desc");
    setCurrentPage(1);
  };

  const showClearButton = Boolean(
    searchQuery || categoryFilter !== "all" || sortBy !== "endTime-desc"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tìm kiếm sản phẩm</h1>
        <p className="text-muted-foreground">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* Search & Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortBy}
        onSearchSubmit={handleSearch}
        onClearFilters={handleClearFilters}
        showClearButton={showClearButton}
      />

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.productid} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
