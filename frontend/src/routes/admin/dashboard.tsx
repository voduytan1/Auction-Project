import {
  StatsGrid,
  AuctionChart,
  RevenueChart,
  UserGrowthChart,
  UpgradeRequestChart,
  CategoryDistributionChart,
} from "@/features/admin";

const DashboardPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Overview */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <StatsGrid />
      </div>

      {/* Charts Row 1: Auctions & Revenue */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <AuctionChart />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[400ms]">
          <RevenueChart />
        </div>
      </div>

      {/* Charts Row 2: Users & Upgrades */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[600ms]">
          <UserGrowthChart />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[800ms]">
          <UpgradeRequestChart />
        </div>
      </div>

      {/* Charts Row 3: Category Distribution (full width) */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
        <CategoryDistributionChart />
      </div>
    </div>
  );
};

export default DashboardPage;
