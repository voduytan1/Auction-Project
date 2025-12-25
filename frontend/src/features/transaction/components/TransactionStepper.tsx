import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Star,
  XCircle,
  MessageSquare,
} from "lucide-react";
import type { Transaction, TransactionStatus } from "@/types/transaction";
import { getStepFromStatus } from "@/types/transaction";

interface TransactionStepperProps {
  transaction: Transaction;
  currentUserRole: "buyer" | "seller";
}

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
  description: string;
  buyerAction?: string;
  sellerAction?: string;
}

const steps: Step[] = [
  {
    id: 0,
    label: "Thanh toán",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Người mua thanh toán đơn hàng",
    buyerAction: "Thanh toán ngay",
    sellerAction: "Chờ người mua thanh toán",
  },
  {
    id: 1,
    label: "Địa chỉ giao hàng",
    icon: <MapPin className="h-5 w-5" />,
    description: "Người mua cung cấp địa chỉ nhận hàng",
    buyerAction: "Nhập địa chỉ",
    sellerAction: "Chờ địa chỉ giao hàng",
  },
  {
    id: 2,
    label: "Vận chuyển",
    icon: <Package className="h-5 w-5" />,
    description: "Người bán gửi hàng và cung cấp mã vận đơn",
    buyerAction: "Chờ người bán gửi hàng",
    sellerAction: "Gửi hàng và nhập mã vận đơn",
  },
  {
    id: 3,
    label: "Nhận hàng",
    icon: <CheckCircle2 className="h-5 w-5" />,
    description: "Người mua xác nhận đã nhận hàng",
    buyerAction: "Xác nhận đã nhận hàng",
    sellerAction: "Chờ xác nhận nhận hàng",
  },
  {
    id: 4,
    label: "Đánh giá",
    icon: <Star className="h-5 w-5" />,
    description: "Cả hai bên đánh giá giao dịch",
    buyerAction: "Đánh giá người bán",
    sellerAction: "Đánh giá người mua",
  },
];

function getStatusColor(status: TransactionStatus): string {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-red-500";
    case "DELIVERED":
      return "bg-blue-500";
    case "SHIPPED":
      return "bg-indigo-500";
    case "PAYMENT_COMPLETED":
    case "AWAITING_SHIPMENT":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}

function getStatusText(status: TransactionStatus): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Chờ thanh toán";
    case "PAYMENT_COMPLETED":
      return "Đã thanh toán";
    case "AWAITING_SHIPMENT":
      return "Chờ gửi hàng";
    case "SHIPPED":
      return "Đã gửi hàng";
    case "DELIVERED":
      return "Đã nhận hàng";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

export function TransactionStepper({
  transaction,
  currentUserRole,
}: TransactionStepperProps) {
  const currentStep = getStepFromStatus(transaction.trangThai);
  const isCancelled = transaction.trangThai === "CANCELLED";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tiến trình đơn hàng</CardTitle>
          <Badge className={getStatusColor(transaction.trangThai)}>
            {getStatusText(transaction.trangThai)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isCancelled ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Giao dịch đã bị hủy bởi{" "}
              {currentUserRole === "seller" ? "người mua" : "người bán"}.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-11 h-full w-0.5 ${
                        isCompleted ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "border-primary bg-primary text-white"
                          : isCurrent
                          ? "border-primary bg-white text-primary"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isCurrent ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            isCurrent
                              ? "text-primary"
                              : isCompleted
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <Badge variant="outline" className="text-xs">
                            Đang thực hiện
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {step.description}
                      </p>

                      {isCurrent && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium text-gray-700">
                            {currentUserRole === "buyer"
                              ? step.buyerAction
                              : step.sellerAction}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chat button */}
        <Separator className="my-6" />
        <Button variant="outline" className="w-full" disabled>
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat với {currentUserRole === "buyer" ? "người bán" : "người mua"}
          <Badge variant="secondary" className="ml-2">
            Sắp có
          </Badge>
        </Button>
      </CardContent>
    </Card>
  );
}
