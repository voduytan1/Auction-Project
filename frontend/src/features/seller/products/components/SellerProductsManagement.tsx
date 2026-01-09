import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "./ProductsTable";

export function SellerProductsManagement() {
  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-12 space-y-4 sm:space-y-6">
      {/* Active Products Only */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Sản phẩm đang bán
          </CardTitle>
          <CardDescription className="test-sm">
            Danh sách các sản phẩm đang được đấu giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable status="ACTIVE" />
        </CardContent>
      </Card>
    </div>
  );
}
