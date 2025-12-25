import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function CompleteOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="container px-4 py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Hoàn tất đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">Đơn hàng #{id} đã được tạo thành công.</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/profile`)}>Xem đơn hàng</Button>
              <Button variant="outline" onClick={() => navigate(`/`)}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
