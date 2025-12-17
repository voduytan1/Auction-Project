import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
        <p className="text-muted-foreground">Manage all users in the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User management interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
