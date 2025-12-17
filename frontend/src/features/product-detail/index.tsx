import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productDetailData, relatedProducts } from "@/data/mock-data";
import { ImageGallery } from "./components/ImageGallery";
import { ProductDescription } from "./components/ProductDescription";
import { BidHistoryTable } from "./components/BidHistoryTable";
import { QASection } from "./components/QASection";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";

const ProductDetail = () => {
  //   const { id } = useParams<{ id: string }>();

  // TODO: Fetch product by ID from API
  // For now, using mock data
  const product = productDetailData;

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
    <div className="bg-slate-50">
      <div className="container px-4 py-6 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>›</span>
            <Link
              to={`/categories/${product.category}`}
              className="hover:text-primary"
            >
              {product.category}
            </Link>
            <span>›</span>
            <span className="text-slate-900">{product.subcategory}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ImageGallery
                mainImage={product.mainImage}
                images={product.images}
                productName={product.name}
              />

              {/* Tabs for Description, Bid History, Q&A */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="history">
                    Lịch sử ({product.bidHistory.length})
                  </TabsTrigger>
                  <TabsTrigger value="qa">
                    Hỏi đáp ({product.questions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <ProductDescription
                    description={product.description}
                    productName={product.name}
                  />
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <BidHistoryTable bidHistory={product.bidHistory} />
                </TabsContent>

                <TabsContent value="qa" className="mt-4">
                  <QASection
                    questions={product.questions}
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

              {/* Wishlist Button */}
              <Button variant="outline" className="w-full" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Thêm vào yêu thích
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts
            products={relatedProducts}
            currentCategory={product.subcategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
