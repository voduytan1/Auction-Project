import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productAPI, type ProductResponse } from "@/services/product.api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productDetailData, relatedProducts } from "@/data/mock-data";
import { ImageGallery } from "./components/ImageGallery";
import { ProductDescription } from "./components/ProductDescription";
import { BidHistoryTable } from "./components/BidHistoryTable";
import { QASection } from "./components/QASection";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";
import { PageLoader } from "@/components/PageLoader";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <PageLoader message="Đang tải sản phẩm..." />;
  }

  if (!product) {
    return (
      <div className="container px-4 py-12 text-center mx-auto">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 px-36 py-6">
      <div className="bg-white container px-4 py-6 mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              {error}. Hiển thị dữ liệu mẫu.
            </p>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>›</span>
            <Link
              to={`/categories/${product.tenCategory}`}
              className="hover:text-primary"
            >
              {product.tenCategory || "Danh mục"}
            </Link>
            <span>›</span>
            <span className="text-slate-900">{product.tenSanPham}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <ImageGallery
                mainImage={product.images?.[0] || productDetailData.mainImage}
                images={product.images?.slice(1) || productDetailData.images}
                productName={product.tenSanPham}
              />

              {/* Tabs for Description, Bid History, Q&A */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="history">
                    Lịch sử ({productDetailData.bidHistory.length})
                  </TabsTrigger>
                  <TabsTrigger value="qa">
                    Hỏi đáp ({productDetailData.questions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <ProductDescription
                    description={product.moTa}
                    productName={product.tenSanPham}
                  />
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  {/* TODO: API chưa trả về bid history */}
                  <BidHistoryTable bidHistory={productDetailData.bidHistory} />
                </TabsContent>

                <TabsContent value="qa" className="mt-4">
                  {/* TODO: API chưa trả về Q&A */}
                  <QASection
                    questions={productDetailData.questions}
                    onAskQuestion={(question) => {
                      console.log("New question:", question);
                      // TODO: Handle submit question
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Product Info & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {/* TODO: API cần trả về 5 sản phẩm khác cùng chuyên mục */}
        <div className="mt-12">
          <RelatedProducts
            products={relatedProducts}
            currentCategory={product.tenCategory || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
