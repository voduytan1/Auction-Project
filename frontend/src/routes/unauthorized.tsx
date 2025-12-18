import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please contact an administrator if you believe this is an error.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
