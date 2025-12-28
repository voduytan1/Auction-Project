import { ViewRatingsSection } from "@/features/bidder/profile/components/ViewRatingsSection";

export default function BidderRatingsPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Lịch sử đánh giá
        </h1>
        <p className="text-muted-foreground">
          Xem điểm đánh giá và chi tiết các lần được đánh giá
        </p>
      </div>
      <ViewRatingsSection />
    </div>
  );
}
