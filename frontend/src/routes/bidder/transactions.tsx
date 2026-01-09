import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionListPage } from "@/features/bidder/transactions/components/TransactionListPage";

export default function BuyerTransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-16rem)]">
      <Card>
        <CardHeader>
          <CardTitle>Đấu giá thắng</CardTitle>
          <CardDescription>
            Xem danh sách các sản phẩm bạn đã thắng đấu giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionListPage role="buyer" />
        </CardContent>
      </Card>
    </div>
  );
}
