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
          <CardTitle className="text-xl sm:text-2xl">Sản phẩm đã bán</CardTitle>
          <CardDescription className="text-sm">
            Quản lý các sản phẩm đã có người thắng đấu giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionListPage role="seller" />
        </CardContent>
      </Card>
    </div>
  );
}
