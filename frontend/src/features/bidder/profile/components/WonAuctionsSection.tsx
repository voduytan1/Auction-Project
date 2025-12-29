import { Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WonAuctionsSectionProps {
  soSanPhamDaThang: number;
}

export function WonAuctionsSection({
  soSanPhamDaThang,
}: WonAuctionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm đã thắng</CardTitle>
        <CardDescription>
          {soSanPhamDaThang} sản phẩm đã thắng đấu giá
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Chưa thắng đấu giá sản phẩm nào</p>
          <p className="text-sm mt-2">
            Tham gia đấu giá để có cơ hội sở hữu sản phẩm yêu thích
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
