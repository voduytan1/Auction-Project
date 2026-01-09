import { TransactionListPage } from "@/features/bidder/transactions/components/TransactionListPage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SellerTransactionsPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Giao dịch của tôi
          </CardTitle>
          <CardDescription className="text-sm">
            Quản lý các giao dịch bán hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionListPage role="seller" />
        </CardContent>
      </Card>
    </div>
  );
}
