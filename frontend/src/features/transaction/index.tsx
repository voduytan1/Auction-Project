import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { TransactionNotification } from "@/components/TransactionNotification";
import { TransactionStepper } from "./components/TransactionStepper";
import { HorizontalStepper } from "./components/HorizontalStepper";
import { TransactionSummary } from "./components/TransactionSummary";
import { PaymentAction } from "./components/PaymentAction";
import { ShippingAction } from "./components/ShippingAction";
import { TrackingAction } from "./components/TrackingAction";
import { DeliveryAction } from "./components/DeliveryAction";
import { RatingAction } from "./components/RatingAction";
import { CancelAction } from "./components/CancelAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { useAppSelector } from "@/hooks/use-redux";
import { useFetch } from "@/hooks/use-fetch";
import { transactionAPI } from "@/services/transaction.api";
import { ratingAPI } from "@/services/rating.api";
import { ArrowLeft, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";
import type { TransactionStatusMessage } from "@/types/websocket";
import { getStepFromStatus } from "@/types/transaction";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [localTransaction, setLocalTransaction] = useState<Transaction | null>(
    null
  );

  // Fetch transaction tá»« API
  const {
    data: transaction,
    loading,
    error,
    refetch,
  } = useFetch(() =>
    transactionAPI
      .getTransactionById(Number(transactionId))
      .then((res) => res.data)
  );

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/auth/login");
    return null;
  }

  // Use local state if available, otherwise use fetched data
  const currentTransaction: Transaction | null =
    localTransaction || transaction;

  if (loading) {
    return (
      <PageWrapper title="Chi tiết giao dịch">
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <PageLoader
            message="Đang tải giao dịch..."
            className="py-16 sm:py-32"
          />
        </div>
      </PageWrapper>
    );
  }

  if (error || !currentTransaction) {
    const backRoute =
      user?.vaitro === "SELLER"
        ? "/seller/profile?tab=sold-products"
        : "/bidder/profile?tab=won-auctions";
    return (
      <PageWrapper title="Lỗi">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(backRoute)}
            className="mb-4"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error?.message || "Không tìm thấy giao dịch"}
            </AlertDescription>
          </Alert>
        </div>
      </PageWrapper>
    );
  }

  // Determine user role
  const currentUserRole: "buyer" | "seller" =
    user?.userid === (currentTransaction as Transaction)?.buyerId
      ? "buyer"
      : "seller";

  // Check if current user is involved in this transaction
  const isUserInvolved =
    user?.userid === currentTransaction?.buyerId ||
    user?.userid === currentTransaction?.sellerId;

  const currentStep = getStepFromStatus(
    (currentTransaction as Transaction)?.trangThai
  );
  const isCancelled =
    (currentTransaction as Transaction)?.trangThai === "CANCELLED";

  // Action handlers
  const handlePaymentComplete = () => {
    // Reload transaction after payment
    refetch();
    toast.success("Thanh toán thành công");
  };

  const handleSubmitAddress = async (address: string) => {
    try {
      const updated = await transactionAPI.addAddress(
        Number(transactionId),
        address
      );
      setLocalTransaction(updated.data);
      toast.success("Đã cập nhật địa chỉ giao hàng");
    } catch (error) {
      toast.error((error as Error).message || "Lỗi khi cập nhật địa chỉ");
    }
  };

  const handleSubmitTracking = async (trackingNumber: string) => {
    try {
      const updated = await transactionAPI.addShipmentProve(
        Number(transactionId),
        trackingNumber
      );
      setLocalTransaction(updated.data);
      toast.success("Đã cập nhật mã vận đơn");
    } catch (error) {
      toast.error((error as Error).message || "Lỗi khi cập nhật mã vận đơn");
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const updated = await transactionAPI.completeTransaction(
        Number(transactionId)
      );
      setLocalTransaction(updated.data);
      toast.success("Xác nhận đã nhận hàng thành công");
    } catch (error) {
      toast.error((error as Error).message || "Lỗi khi xác nhận nhận hàng");
    }
  };

  const handleSubmitRating = async (rating: 1 | -1, comment: string) => {
    try {
      // Xác định người được đánh giá (rateeId)
      const rateeId =
        currentUserRole === "buyer"
          ? currentTransaction.sellerId
          : currentTransaction.buyerId;

      await ratingAPI.createRating({
        transactionId: Number(transactionId),
        rateeId: rateeId,
        diem: rating,
        nhanXet: comment,
      });

      toast.success(`Đã đánh giá ${rating === 1 ? "+1" : "-1"} điểm`);
      // Reload transaction để cập nhật trạng thái
      refetch();
    } catch (error) {
      toast.error((error as Error).message || "Lỗi khi đánh giá");
    }
  };

  const handleCancelTransaction = async () => {
    try {
      const updated = await transactionAPI.cancelTransaction(
        Number(transactionId)
      );
      setLocalTransaction(updated.data);
      toast.success("Đã hủy giao dịch");
    } catch (error) {
      toast.error((error as Error).message || "Lỗi khi hủy giao dịch");
    }
  };

  // Handle transaction status change from WebSocket
  const handleTransactionStatusChange = (message: TransactionStatusMessage) => {
    // Update local transaction with new status
    if (currentTransaction) {
      setLocalTransaction({
        ...currentTransaction,
        trangThai: message.trangThai as any,
      });
      // Refetch to get full updated data
      refetch();
    }
  };

  return (
    <PageWrapper title={`Giao dịch #${transactionId}`}>
      {/* Transaction Status Update Notification - Only for buyer/seller */}
      {transactionId && isUserInvolved && (
        <TransactionNotification
          transactionId={Number(transactionId)}
          onStatusChange={handleTransactionStatusChange}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 flex gap-2 items-center">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(
                currentUserRole === "seller"
                  ? "/seller/profile?tab=sold-products"
                  : "/bidder/profile?tab=won-auctions"
              )
            }
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Mobile Horizontal Stepper - Only on mobile */}
          <div className="md:hidden space-y-4">
            <HorizontalStepper
              transaction={currentTransaction}
              currentUserRole={currentUserRole}
            />
            <Card>
              <CardContent className="p-4 space-y-4">
                <TransactionSummary
                  transaction={currentTransaction}
                  currentUserRole={currentUserRole}
                />

                {/* Mobile Action Buttons */}
                {!isCancelled && (
                  <div className="border-t pt-4">
                    {/* Step 0: Payment */}
                    {currentStep === 0 && currentUserRole === "buyer" && (
                      <PaymentAction
                        onPaymentComplete={handlePaymentComplete}
                      />
                    )}

                    {/* Step 1: Shipping Address */}
                    {currentStep === 1 &&
                      currentUserRole === "buyer" &&
                      currentTransaction.trangThai === "PAYMENT_COMPLETED" && (
                        <ShippingAction
                          initialAddress={currentTransaction.diaChiGiaoHang}
                          onSubmitAddress={handleSubmitAddress}
                        />
                      )}

                    {/* Step 2: Tracking (Seller) */}
                    {currentStep === 2 &&
                      currentUserRole === "seller" &&
                      currentTransaction.trangThai === "AWAITING_SHIPMENT" && (
                        <TrackingAction
                          initialTracking={currentTransaction.maVanDon}
                          onSubmitTracking={handleSubmitTracking}
                        />
                      )}

                    {/* Step 2: Waiting for seller (Buyer) */}
                    {currentStep === 2 &&
                      currentUserRole === "buyer" &&
                      currentTransaction.trangThai === "AWAITING_SHIPMENT" && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Đang chờ người bán gửi hàng.
                          </AlertDescription>
                        </Alert>
                      )}

                    {/* Step 3: Delivery Confirmation */}
                    {currentStep === 3 && currentUserRole === "buyer" && (
                      <DeliveryAction
                        onConfirmDelivery={handleConfirmDelivery}
                      />
                    )}

                    {/* Step 3: Waiting for buyer (Seller) */}
                    {currentStep === 3 &&
                      currentUserRole === "seller" &&
                      currentTransaction.trangThai === "SHIPPED" && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Đã gửi hàng. Đang chờ người mua xác nhận nhận hàng.
                          </AlertDescription>
                        </Alert>
                      )}

                    {/* Step 4: Rating */}
                    {currentTransaction.trangThai === "COMPLETED" && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-4 w-5 text-yellow-500" />
                          <h4 className="font-semibold text-sm">Đánh giá</h4>
                        </div>
                        <RatingAction
                          otherPartyRole={
                            currentUserRole === "buyer" ? "seller" : "buyer"
                          }
                          onSubmitRating={handleSubmitRating}
                        />
                      </div>
                    )}

                    {/* Cancel button (seller only, when PENDING_PAYMENT) */}
                    {currentUserRole === "seller" &&
                      currentTransaction.trangThai === "PENDING_PAYMENT" && (
                        <CancelAction
                          currentUserRole={currentUserRole}
                          onCancel={handleCancelTransaction}
                        />
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Left column - Stepper (Hidden on mobile) */}
          <div className="hidden md:block lg:col-span-2">
            <TransactionStepper
              transaction={currentTransaction}
              currentUserRole={currentUserRole}
            />
          </div>

          {/* Right column - Summary & Actions (Desktop only) */}
          <div className="hidden md:block">
            <div className="sticky top-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {/* Summary Content */}
                  <TransactionSummary
                    transaction={currentTransaction}
                    currentUserRole={currentUserRole}
                  />

                  {/* Action Section - Integrated */}
                  {!isCancelled && (
                    <>
                      <div className="border-t pt-4">
                        {/* Step 0: Payment (PENDING_PAYMENT) */}
                        {currentStep === 0 && currentUserRole === "buyer" && (
                          <PaymentAction
                            onPaymentComplete={handlePaymentComplete}
                          />
                        )}

                        {/* Step 1: Shipping Address (PAYMENT_COMPLETED) */}
                        {currentStep === 1 &&
                          currentUserRole === "buyer" &&
                          currentTransaction.trangThai ===
                            "PAYMENT_COMPLETED" && (
                            <ShippingAction
                              initialAddress={currentTransaction.diaChiGiaoHang}
                              onSubmitAddress={handleSubmitAddress}
                            />
                          )}

                        {/* Step 2: Waiting for seller (AWAITING_SHIPMENT + buyer) */}
                        {currentStep === 2 &&
                          currentUserRole === "buyer" &&
                          currentTransaction.trangThai ===
                            "AWAITING_SHIPMENT" && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                Đang chờ người bán gửi hàng.
                              </AlertDescription>
                            </Alert>
                          )}

                        {/* Step 2: Tracking Number (AWAITING_SHIPMENT + seller) */}
                        {currentStep === 2 &&
                          currentUserRole === "seller" &&
                          currentTransaction.trangThai ===
                            "AWAITING_SHIPMENT" && (
                            <TrackingAction
                              initialTracking={currentTransaction.maVanDon}
                              onSubmitTracking={handleSubmitTracking}
                            />
                          )}

                        {/* Step 3: Delivery Confirmation (SHIPPED) */}
                        {currentStep === 3 && currentUserRole === "buyer" && (
                          <DeliveryAction
                            onConfirmDelivery={handleConfirmDelivery}
                          />
                        )}

                        {/* Step 3: Waiting for buyer (SHIPPED + seller) */}
                        {currentStep === 3 &&
                          currentUserRole === "seller" &&
                          currentTransaction.trangThai === "SHIPPED" && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                Đã gửi hàng. Đang chờ người mua xác nhận nhận
                                hàng.
                              </AlertDescription>
                            </Alert>
                          )}

                        {/* Step 4: Rating (COMPLETED) */}
                        {currentTransaction.trangThai === "COMPLETED" && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="h-4 w-5 text-yellow-500" />
                              <h4 className="font-semibold text-sm">
                                Đánh giá
                              </h4>
                            </div>
                            <RatingAction
                              otherPartyRole={
                                currentUserRole === "buyer" ? "seller" : "buyer"
                              }
                              onSubmitRating={handleSubmitRating}
                            />
                          </div>
                        )}

                        {/* Cancel button (seller only, when PENDING_PAYMENT) */}
                        {currentUserRole === "seller" &&
                          currentTransaction.trangThai ===
                            "PENDING_PAYMENT" && (
                            <CancelAction
                              currentUserRole={currentUserRole}
                              onCancel={handleCancelTransaction}
                            />
                          )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
