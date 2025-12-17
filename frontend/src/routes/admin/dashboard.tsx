import { StatsGrid, RecentActivity, TopAuctions } from "@/features/admin";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <TopAuctions />
      </div>
    </div>
  );
};

export default DashboardPage;
