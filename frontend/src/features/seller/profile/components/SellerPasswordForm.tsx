import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordForm } from "@/features/bidder/profile/components/ChangePasswordForm";

export function SellerPasswordForm() {
  return (
    <Card>
      <CardContent className="pt-6">
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
