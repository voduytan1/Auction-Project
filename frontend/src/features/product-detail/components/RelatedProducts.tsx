import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { ProductCarousel } from "@/components/ProductCarousel";
import { useState, useEffect } from "react";
import { productAPI, type ProductResponse } from "@/services/product.api";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
  categoryName: string;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
  categoryName,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.search({
          categoryId,
          size: 6, // Lấy 6 để filter ra current product
        });
        // Filter out current product and limit to 5
        // Response is already unwrapped by interceptor to ProductResponse[]
        const data = Array.isArray(response.data) ? response.data : [];
        const filtered = data
          .filter((p: ProductResponse) => p.productid !== currentProductId)
          .slice(0, 5);
        setProducts(filtered);
      } catch (error) {
        console.error("❌ Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <PageLoader
            message="Đang tải sản phẩm liên quan..."
            className="py-8"
          />
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Không có sản phẩm nào cùng chuyên mục
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm cùng chuyên mục: {categoryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCarousel products={products} />
      </CardContent>
    </Card>
  );
}
