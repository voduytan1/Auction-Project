import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTopAuctions } from "@/data/mock-data";

export function TopAuctions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Auctions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTopAuctions.map((auction, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{auction.title}</p>
                <p className="text-xs text-muted-foreground">
                  {auction.bids} bids
                </p>
              </div>
              <span className="text-sm font-semibold">{auction.price}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
