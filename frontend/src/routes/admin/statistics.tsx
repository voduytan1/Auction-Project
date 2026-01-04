import { AuctionChart } from "@/features/admin/dashboard/components/AuctionChart";
import { CategoryDistributionChart } from "@/features/admin/dashboard/components/CategoryDistributionChart";
import { RevenueChart } from "@/features/admin/dashboard/components/RevenueChart";
import { UpgradeRequestChart } from "@/features/admin/dashboard/components/UpgradeRequestChart";
import { UserGrowthChart } from "@/features/admin/dashboard/components/UserGrowthChart";

const StatisticsPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Charts Row 1: Auctions & Revenue */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <AuctionChart />
        </div>
        <div>
          <RevenueChart />
        </div>
      </div>

      {/* Charts Row 2: Users & Upgrades */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <UserGrowthChart />
        </div>
        <div>
          <UpgradeRequestChart />
        </div>
      </div>

      {/* Charts Row 3: Category Distribution (full width) */}
      <div>
        <CategoryDistributionChart />
      </div>
    </div>
  );
};

export default StatisticsPage;
