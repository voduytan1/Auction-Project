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
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-12 space-y-4 sm:space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Quản lý sản phẩm
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý các sản phẩm đấu giá của bạn
          </p>
        </div>
        <Button
          onClick={() => navigate("/seller/products/create")}
          className="gap-2 w-full sm:w-auto"
          size="default"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Đăng sản phẩm</span>
          <span className="sm:hidden">Đăng sản phẩm mới</span>
        </Button>
      </div>

      {/* Tabs for Product Status */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="active" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Đang bán</span>
            <span className="sm:hidden">Bán</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Đã có người thắng</span>
            <span className="sm:hidden">Thắng</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Đã hủy</span>
            <span className="sm:hidden">Hủy</span>
          </TabsTrigger>
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
