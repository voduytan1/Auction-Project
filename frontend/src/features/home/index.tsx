import { useEffect, useState } from "react";
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
        console.log("Ending Soon:", endingSoon);
        setEndingSoonProducts((endingSoon?.data as any) || []);

        // Fetch highest price products (5 items, sort by price DESC)
        const highestPrice = await productAPI.search({
          size: 5,
          sortBy: "giaHienTai",
          sortOrder: "desc",
          status: "ACTIVE",
        });
        setHighestPriceProducts((highestPrice?.data as any) || []);

        // Fetch most recent products (5 items, sort by createdAt DESC)
        const mostRecent = await productAPI.search({
          size: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
          status: "ACTIVE",
        });
        setMostBidsProducts((mostRecent?.data as any) || []);
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
    <div className="space-y-16 pb-16 w-full">
      <EndingSoonSection products={endingSoonProducts} />
      <MostBidsSection products={mostBidsProducts} />
      <HighestPriceSection products={highestPriceProducts} />
    </div>
  );
};

export default Home;
