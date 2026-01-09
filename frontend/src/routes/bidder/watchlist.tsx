import { PageWrapper } from "@/components/PageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WatchlistSection } from "@/features/bidder/profile/components/WatchlistSection";

export default function WatchlistPage() {
  return (
    <PageWrapper title="Danh sách yêu thích">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách yêu thích</CardTitle>
            <CardDescription>Các sản phẩm bạn đang theo dõi</CardDescription>
          </CardHeader>
          <CardContent>
            <WatchlistSection />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
