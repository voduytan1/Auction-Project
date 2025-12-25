import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageWrapper } from "@/components/PageWrapper";
import { TransactionStepper } from "../components/TransactionStepper";
import { TransactionSummary } from "../components/TransactionSummary";
import { PaymentAction } from "../components/PaymentAction";
import { ShippingAction } from "../components/ShippingAction";
import { TrackingAction } from "../components/TrackingAction";
import { DeliveryAction } from "../components/DeliveryAction";
import { RatingAction } from "../components/RatingAction";
import { CancelAction } from "../components/CancelAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/hooks/use-redux";
import { useFetch } from "@/hooks/use-fetch";
import { transactionAPI } from "@/services/transaction.api";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";
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
  } = useFetch(() => transactionAPI.getTransactionById(Number(transactionId)));

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/auth/login");
    return null;
  }

  // Use local state if available, otherwise use fetched data
  const currentTransaction = localTransaction || transaction;

  if (loading) {
    return (
      <PageWrapper title="Đang tải...">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !currentTransaction) {
    return (
      <PageWrapper title="Lỗi">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
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

  const handleSubmitAddress = (address: string) => {
    // TODO: Call API to update shipping address
    if (currentTransaction) {
      setLocalTransaction({
        ...(currentTransaction as Transaction),
        diaChiGiaoHang: address,
        trangThai: "AWAITING_SHIPMENT",
      });
      toast.success("Đã cập nhật địa chỉ giao hàng");
    }
  };

  const handleSubmitTracking = (trackingNumber: string) => {
    // TODO: Call API to update tracking number
    if (currentTransaction) {
      setLocalTransaction({
        ...(currentTransaction as Transaction),
        maVanDon: trackingNumber,
        trangThai: "SHIPPED",
      });
      toast.success("Đã cập nhật mã vận đơn");
    }
  };

  const handleConfirmDelivery = () => {
    // TODO: Call API to confirm delivery
    if (currentTransaction) {
      setLocalTransaction({
        ...(currentTransaction as Transaction),
        trangThai: "DELIVERED",
        thoiGianNhanHang: new Date().toISOString(),
      });
      toast.success("Xác nhận đã nhận hàng thành công");
    }
  };

  const handleSubmitRating = (rating: 1 | -1, _comment: string) => {
    // TODO: Call rating API
    toast.success(`Đã đánh giá ${rating === 1 ? "+1" : "-1"} điểm`);
  };

  const handleCancelTransaction = (_reason: string) => {
    // TODO: Call API to cancel transaction
    setLocalTransaction({ ...currentTransaction, trangThai: "CANCELLED" });
    toast.success("Đã hủy giao dịch");
  };

  // Determine if cancel action is available
  const canCancel = currentUserRole === "seller" || currentStep < 3;

  return (
    <PageWrapper title={`Giao dịch #${transactionId}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex gap-2 items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="ml-auto flex gap-2 items-center">
            <Badge
              variant={currentUserRole === "buyer" ? "default" : "outline"}
            >
              {currentUserRole === "buyer" ? "👤 Người mua" : "🪙 Người bán"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Stepper only */}
          <div className="lg:col-span-2">
            <TransactionStepper
              transaction={currentTransaction}
              currentUserRole={currentUserRole}
            />
          </div>

          {/* Right column - Summary & Actions */}
          <div className="space-y-6">
            <TransactionSummary
              transaction={currentTransaction}
              currentUserRole={currentUserRole}
            />

            {/* Action Card based on current step */}
            {!isCancelled && (
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Step 0: Payment */}
                  {currentStep === 0 && currentUserRole === "buyer" && (
                    <PaymentAction onPaymentComplete={handlePaymentComplete} />
                  )}

                  {/* Step 1: Shipping Address */}
                  {currentStep === 1 && currentUserRole === "buyer" && (
                    <ShippingAction
                      initialAddress={currentTransaction.diaChiGiaoHang}
                      onSubmitAddress={handleSubmitAddress}
                    />
                  )}

                  {/* Step 2: Tracking Number */}
                  {currentStep === 2 && currentUserRole === "seller" && (
                    <TrackingAction
                      initialTracking={currentTransaction.maVanDon}
                      onSubmitTracking={handleSubmitTracking}
                    />
                  )}

                  {/* Step 3: Delivery Confirmation */}
                  {currentStep === 3 && currentUserRole === "buyer" && (
                    <DeliveryAction onConfirmDelivery={handleConfirmDelivery} />
                  )}

                  {/* Step 4: Rating */}
                  {currentStep === 4 && (
                    <RatingAction
                      otherPartyRole={
                        currentUserRole === "buyer" ? "seller" : "buyer"
                      }
                      onSubmitRating={handleSubmitRating}
                    />
                  )}

                  {/* Cancel button (available for seller anytime, buyer before delivery) */}
                  {canCancel && (
                    <CancelAction
                      currentUserRole={currentUserRole}
                      onCancel={handleCancelTransaction}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
