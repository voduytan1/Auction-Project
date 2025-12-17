import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const AuctionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Auctions Management
        </h2>
        <p className="text-muted-foreground">
          Manage all auctions in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Auctions</CardTitle>
          <CardDescription>A list of all auctions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Auctions management interface coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionsPage;
