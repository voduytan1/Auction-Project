import {
  StatsGrid,
  RecentActivity,
  TopAuctions,
  AuctionChart,
  RevenueChart,
  UserGrowthChart,
  UpgradeRequestChart,
  CategoryDistributionChart,
} from "@/features/admin";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsGrid />

      {/* Charts Row 1: Auctions & Revenue */}
      <div className="grid gap-4 md:grid-cols-2">
        <AuctionChart />
        <RevenueChart />
      </div>

      {/* Charts Row 2: Users & Upgrades */}
      <div className="grid gap-4 md:grid-cols-2">
        <UserGrowthChart />
        <UpgradeRequestChart />
      </div>

      {/* Charts Row 3: Category Distribution (full width) */}
      <CategoryDistributionChart />

      {/* Activity & Top Auctions */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <TopAuctions />
      </div>
    </div>
  );
};

export default DashboardPage;
