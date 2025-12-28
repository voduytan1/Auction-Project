import {
  CheckCircle2,
  Circle,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react";
import type { Transaction } from "@/types/transaction";
import { getStepFromStatus } from "@/types/transaction";

interface HorizontalStepperProps {
  transaction: Transaction;
  currentUserRole: "buyer" | "seller";
}

const steps = [
  { id: 0, label: "Thanh toán", icon: CreditCard },
  { id: 1, label: "Địa chỉ", icon: MapPin },
  { id: 2, label: "Vận chuyển", icon: Package },
  { id: 3, label: "Nhận hàng", icon: CheckCircle2 },
  { id: 4, label: "Hoàn tất", icon: CheckCircle2 },
];

export function HorizontalStepper({ transaction }: HorizontalStepperProps) {
  const currentStep = getStepFromStatus(transaction.trangThai);
  const isCancelled = transaction.trangThai === "CANCELLED";

  return (
    <div className="bg-background border rounded-lg py-6 px-4 mb-4">
      <div className="relative">
        {/* Progress Line */}
        <div
          className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"
          style={{ zIndex: 0 }}
        >
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${
                isCancelled ? 0 : (currentStep / (steps.length - 1)) * 100
              }%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 1 }}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = !isCancelled && index < currentStep;
            const isCurrent = !isCancelled && index === currentStep;
            const isUpcoming = !isCancelled && index > currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Icon Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted ? "bg-primary text-white" : ""}
                    ${
                      isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : ""
                    }
                    ${
                      isUpcoming || isCancelled
                        ? "bg-white border-2 border-gray-300 text-gray-400"
                        : ""
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : isCurrent ? (
                    <StepIcon className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center
                    ${
                      isCompleted || isCurrent
                        ? "text-primary"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
