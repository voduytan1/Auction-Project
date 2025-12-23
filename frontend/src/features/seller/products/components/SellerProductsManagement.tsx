import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "./ProductsTable";

export function SellerProductsManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="container mx-auto py-6 px-12 space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm đấu giá của bạn
          </p>
        </div>
        <Button
          onClick={() => navigate("/seller/products/create")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Đăng sản phẩm
        </Button>
      </div>

      {/* Tabs for Product Status */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="active">Đang bán</TabsTrigger>
          <TabsTrigger value="completed">Đã có người thắng</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        {/* Active Products */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đang đấu giá</CardTitle>
              <CardDescription>
                Danh sách các sản phẩm đang được đấu giá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable status="ACTIVE" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Products */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã có người thắng</CardTitle>
              <CardDescription>
                Danh sách các sản phẩm đã kết thúc đấu giá và có người thắng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable status="COMPLETED" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cancelled Products */}
        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã hủy</CardTitle>
              <CardDescription>
                Danh sách các sản phẩm đã bị hủy giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable status="CANCELLED" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
