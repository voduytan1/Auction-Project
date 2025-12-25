import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Array<any>>([]);

  useEffect(() => {
    // TODO: replace with real API call to fetch user's orders
    setOrders([
      { id: 101, productName: "IPhone 17 Pro Max 256GB", status: "Pending" },
      { id: 102, productName: "MacBook Air Pro", status: "Paid" },
    ]);
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

      <div className="grid gap-6">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle>Đơn hàng #{o.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Sản phẩm</div>
                  <div className="font-semibold">{o.productName}</div>
                  <div className="text-sm text-slate-600">Trạng thái</div>
                  <div className="font-medium">{o.status}</div>
                </div>
                <div>
                  <Button onClick={() => navigate(`/orders/${o.id}/complete`)}>
                    Xem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
