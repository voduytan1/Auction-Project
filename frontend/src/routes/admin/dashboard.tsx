import { StatsGrid } from "@/features/admin/dashboard/components/StatsGrid";
import { TopAuctions } from "@/features/admin/dashboard/components/TopAuctions";


const DashboardPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Overview */}
      <div>
        <StatsGrid />
      </div>

      {/* Top 3 Auctions */}
      <div>
        <TopAuctions />
      </div>
    </div>
  );
};

export default DashboardPage;
