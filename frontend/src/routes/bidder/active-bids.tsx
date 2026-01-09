import { PageWrapper } from "@/components/PageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActiveBidsSection } from "@/features/bidder/profile/components/ActiveBidsSection";

export default function ActiveBidsPage() {
  return (
    <PageWrapper title="Sản phẩm đang đấu giá">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm đang đấu giá</CardTitle>
            <CardDescription>
              Danh sách các sản phẩm bạn đang tham gia đấu giá
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActiveBidsSection />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
