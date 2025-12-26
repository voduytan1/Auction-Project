import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productAPI, type ProductResponse } from "@/services/product.api";
import { paymentAPI } from "@/services/payment.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, PartyPopper } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productDetailData, relatedProducts } from "@/data/mock-data";
import { ImageGallery } from "./components/ImageGallery";
import { ProductDescription } from "./components/ProductDescription";
import { BidHistoryTable } from "./components/BidHistoryTable";
import { QASection } from "./components/QASection";
import { ProductInfo } from "./components/ProductInfo";
import { RelatedProducts } from "./components/RelatedProducts";
import { PageLoader } from "@/components/PageLoader";
import { useAppSelector } from "@/hooks/use-redux";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showSellerDialog, setShowSellerDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  // Check if current user should see winner/seller dialog
  useEffect(() => {
    if (
      !product ||
      !isAuthenticated ||
      !user ||
      product.trangThai !== "COMPLETED"
    ) {
      return;
    }

    const isSeller = String(product.sellerId) === String(user.userid);
    const isWinner =
      product.bidderId && String(product.bidderId) === String(user.userid);

    if (isWinner) {
      setShowWinnerDialog(true);
    } else if (isSeller) {
      setShowSellerDialog(true);
    }
  }, [product, user, isAuthenticated]);

  const handlePayNow = async () => {
    if (!product?.productid) return;

    try {
      setIsProcessingPayment(true);
      toast.loading("Đang tạo phiên thanh toán...");

      const { url } = await paymentAPI.createStripeCheckoutSession(
        product.productid
      );

      toast.dismiss();
      toast.success("Chuyển hướng đến trang thanh toán...");

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      toast.dismiss();
      toast.error("Lỗi khi tạo phiên thanh toán: " + (error as Error).message);
      setIsProcessingPayment(false);
    }
  };

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
    <div className="px-20">
      {/* Winner Dialog */}
      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <PartyPopper className="h-8 w-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Chúc mừng! Bạn đã thắng đấu giá
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Bạn đã thắng sản phẩm{" "}
              <span className="font-semibold text-foreground">
                {product?.tenSanPham}
              </span>{" "}
              với giá{" "}
              <span className="font-semibold text-accent">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.giaHienTai || 0)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowWinnerDialog(false)}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button
              onClick={handlePayNow}
              disabled={isProcessingPayment}
              className="flex-1"
            >
              {isProcessingPayment ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Thanh toán ngay
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seller Dialog */}
      <Dialog open={showSellerDialog} onOpenChange={setShowSellerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Sản phẩm đã được bán!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Sản phẩm{" "}
              <span className="font-semibold text-foreground">
                {product?.tenSanPham}
              </span>{" "}
              của bạn đã được bán thành công với giá{" "}
              <span className="font-semibold text-green-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.giaHienTai || 0)}
              </span>
              . Hãy chờ người mua thanh toán và hoàn tất giao dịch.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSellerDialog(false)}
              className="w-full"
            >
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              to={`/category/${product.parentCategoryId}`}
              className="hover:text-primary"
            >
              {product.tenDanhMucCha}
            </Link>
            <span>›</span>
            <Link
              to={`/category/${product.categoryId}`}
              className="hover:text-primary"
            >
              {product.tenDanhMuc}
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
                  {
                    // derive sellerId from product to avoid refetching inside BidHistoryTable
                  }
                  <BidHistoryTable
                    productId={product.productid}
                    initialSize={5}
                    sellerId={product.sellerId}
                  />
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
            currentCategory={product.tenDanhMuc || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
