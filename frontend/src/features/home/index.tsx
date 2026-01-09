import { useEffect, useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { EndingSoonSection } from "./components/EndingSoonSection";
import { HighestPriceSection } from "./components/HighestPriceSection";
import { MostBidsSection } from "./components/MostBidsSection";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { PageLoader } from "@/components/PageLoader";

const Home = () => {
  const [endingSoonProducts, setEndingSoonProducts] = useState<
    ProductResponse[]
  >([]);
  const [highestPriceProducts, setHighestPriceProducts] = useState<
    ProductResponse[]
  >([]);
  const [mostBidsProducts, setMostBidsProducts] = useState<ProductResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch ending soon products (5 items, sort by endTime ASC)
        const endingSoon = await productAPI.search({
          size: 5,
          sortBy: "thoiGianKetThuc",
          sortOrder: "asc",
          status: "ACTIVE",
        });
        setEndingSoonProducts((endingSoon?.data as any) || []);

        // Fetch highest price products (5 items, sort by price DESC)
        const highestPrice = await productAPI.search({
          size: 5,
          sortBy: "giaHienTai",
          sortOrder: "desc",
          status: "ACTIVE",
        });
        setHighestPriceProducts((highestPrice?.data as any) || []);

        // Fetch most bids products (5 items, sort by soLuotRaGia DESC)
        const mostBids = await productAPI.search({
          size: 5,
          sortBy: "soLuotRaGia",
          sortOrder: "desc",
          status: "ACTIVE",
        });
        setMostBidsProducts((mostBids?.data as any) || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <PageLoader message="Đang tải sản phẩm..." />;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Product Sections */}
      <div className="space-y-16 py-12">
        <EndingSoonSection products={endingSoonProducts} />
        <MostBidsSection products={mostBidsProducts} />
        <HighestPriceSection products={highestPriceProducts} />
      </div>
    </div>
  );
};

export default Home;
