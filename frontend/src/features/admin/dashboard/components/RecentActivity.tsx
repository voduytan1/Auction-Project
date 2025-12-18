import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDashboardActivities } from "@/data/mock-data";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDashboardActivities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div
                className={`w-2 h-2 bg-${activity.color}-500 rounded-full mr-3`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
