import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Search, Filter, MoreHorizontal } from "lucide-react";

const AuctionsPage = () => {
  // Mock data
  const auctions = [
    {
      id: 1,
      title: "iPhone 15 Pro Max 256GB",
      seller: "Nguyễn Văn A",
      currentBid: "25,000,000 VNĐ",
      bids: 156,
      endDate: "2025-12-20 14:30",
      status: "active",
    },
    {
      id: 2,
      title: "MacBook Pro M3 16GB",
      seller: "Trần Thị B",
      currentBid: "35,000,000 VNĐ",
      bids: 98,
      endDate: "2025-12-19 10:00",
      status: "active",
    },
    {
      id: 3,
      title: "PS5 Console",
      seller: "Lê Văn C",
      currentBid: "12,000,000 VNĐ",
      bids: 76,
      endDate: "2025-12-18 20:00",
      status: "ending_soon",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Auctions</CardTitle>
              <CardDescription>
                Danh sách tất cả auctions trong hệ thống
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm auction..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Giá hiện tại</TableHead>
                  <TableHead>Số bids</TableHead>
                  <TableHead>Kết thúc</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-medium">
                      {auction.title}
                    </TableCell>
                    <TableCell>{auction.seller}</TableCell>
                    <TableCell className="font-semibold">
                      {auction.currentBid}
                    </TableCell>
                    <TableCell>{auction.bids}</TableCell>
                    <TableCell className="text-sm">{auction.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          auction.status === "ending_soon"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {auction.status === "ending_soon"
                          ? "Sắp kết thúc"
                          : "Đang diễn ra"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionsPage;
