import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { mockAdminAuctions } from "@/data/mock-data";

export function AuctionsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
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
            <Input
              placeholder="Tìm kiếm auction..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              {mockAdminAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell className="font-medium">{auction.title}</TableCell>
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
  );
}
