import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productAPI, type ProductResponse } from "@/services/product.api";
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
  const [isProcessingPayment] = useState(false);
  const navigate = useNavigate();

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

  const handlePayNow = () => {
    if (!product?.transactionId) {
      toast.error("Không tìm thấy thông tin giao dịch");
      return;
    }

    // Navigate to transaction detail page
    navigate(`/transactions/${product.transactionId}/detail`);
    setShowWinnerDialog(false);
  };

  const handleRefreshProduct = async () => {
    if (!id) return;
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      console.error("Error refetching product:", err);
      toast.error("Không thể cập nhật thông tin sản phẩm");
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
    <div className="lg:px-20">
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
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSellerDialog(false)}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button
              onClick={() => {
                if (!product?.transactionId) {
                  toast.error("Không tìm thấy thông tin giao dịch");
                  return;
                }
                navigate(`/transactions/${product.transactionId}/detail`);
                setShowSellerDialog(false);
              }}
              className="flex-1"
            >
              Xem chi tiết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white container px-0 py-6 mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              {error}. Hiển thị dữ liệu mẫu.
            </p>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap pb-2">
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

        {/* MAIN CONTENT LAYOUT FIX 
            Mobile & Tablet: Flex Column (Order: Image -> Info -> Tabs)
            Desktop (lg): Grid 12 cols (7-5 split) - Ưu tiên ảnh
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 1. PRODUCT IMAGES */}
          {/* Mobile & Tablet: Order 1 
              Desktop: 7/12 cột 
          */}
          <div className="order-1 lg:col-span-7">
            <ImageGallery
              mainImage={product.images?.[0]}
              images={product.images?.slice(1)}
              productName={product.tenSanPham}
            />
          </div>

          {/* 2. PRODUCT INFO & ACTIONS */}
          {/* Mobile & Tablet: Order 2 
              Desktop: 5/12 cột, Sticky
              Row-span-2: Trượt dọc theo nội dung bên trái
          */}
          <div className="order-2 mt-6 lg:mt-0 lg:col-span-5 lg:row-span-2">
            <div className="lg:sticky lg:top-20 space-y-4">
              <ProductInfo
                product={product}
                onRefreshProduct={handleRefreshProduct}
              />
            </div>
          </div>

          {/* 3. TABS (Description, History, QA) */}
          {/* Mobile & Tablet: Order 3 
              Desktop: 7/12 cột (Dưới ảnh)
          */}
          <div className="order-3 mt-8 lg:col-span-7">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="history">Lịch sử</TabsTrigger>
                <TabsTrigger value="qa">Hỏi đáp</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <ProductDescription
                  description={product.moTa}
                  productName={product.tenSanPham}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <BidHistoryTable
                  productId={product.productid}
                  initialSize={5}
                  sellerId={product.sellerId}
                />
              </TabsContent>

              <TabsContent value="qa" className="mt-4">
                <QASection
                  productId={product.productid}
                  sellerId={product.sellerId}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.productid}
            categoryName={product.tenDanhMuc || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
